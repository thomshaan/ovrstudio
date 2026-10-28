import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import { PROJECTS as INITIAL_PROJECTS } from './src/data/projects';
import { TEAM_MEMBERS as INITIAL_TEAM } from './src/data/team';
import { Project, TeamMember } from './src/types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isProduction = process.env.NODE_ENV === 'production';
const PORT = parseInt(process.env.PORT || '3000', 10);

// In-memory data store initialized with default projects and team
let projectsStore: Project[] = [...INITIAL_PROJECTS];
let teamStore: TeamMember[] = [...INITIAL_TEAM];
const inquiriesStore: Array<{ id: string; timestamp: string; data: unknown }> = [];

async function startServer() {
  const app = express();

  // Middleware
  app.use(express.json({ limit: '10mb' }));

  // API Endpoints
  // 1. Projects API
  app.get('/api/projects', (_req: Request, res: Response) => {
    res.json(projectsStore);
  });

  app.post('/api/projects', (req: Request, res: Response) => {
    const newProject: Project = {
      ...req.body,
      id: req.body.id || `proj-${Date.now()}`,
      year: req.body.year || new Date().getFullYear().toString(),
      deliverables: req.body.deliverables || ['Creative Production', 'Concept Art'],
      toolsUsed: req.body.toolsUsed || ['Unity', 'Photoshop'],
      highlights: req.body.highlights || [{ label: 'Release', value: '2026' }],
    };
    projectsStore = [newProject, ...projectsStore];
    res.status(201).json(newProject);
  });

  app.put('/api/projects/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const index = projectsStore.findIndex((p) => p.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Project not found' });
    }
    projectsStore[index] = { ...projectsStore[index], ...req.body };
    res.json(projectsStore[index]);
  });

  app.delete('/api/projects/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const initialLen = projectsStore.length;
    projectsStore = projectsStore.filter((p) => p.id !== id);
    if (projectsStore.length === initialLen) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json({ success: true, id });
  });

  app.post('/api/projects/reset', (_req: Request, res: Response) => {
    projectsStore = [...INITIAL_PROJECTS];
    res.json(projectsStore);
  });

  // 2. Team API
  app.get('/api/team', (_req: Request, res: Response) => {
    res.json(teamStore);
  });

  app.put('/api/team/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const index = teamStore.findIndex((t) => t.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Team member not found' });
    }
    teamStore[index] = { ...teamStore[index], ...req.body };
    res.json(teamStore[index]);
  });

  // 3. Contact Inquiries API
  app.post('/api/contact', (req: Request, res: Response) => {
    const inquiry = {
      id: `inq-${Date.now()}`,
      timestamp: new Date().toISOString(),
      data: req.body,
    };
    inquiriesStore.push(inquiry);
    res.status(201).json({ success: true, id: inquiry.id });
  });

  // Vite middleware in dev or static files in production
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[OVRStudio Server] running at http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[OVRStudio Server] Failed to start:', err);
  process.exit(1);
});
