import { Link, CreateLinkRequest, ApiResponse } from '../types';

// Constants
const STORAGE_KEY = 'tinylink_db';
const DELAY_MS = 400; // Simulate network latency

// Helper to generate random code
const generateCode = (length: number = 6): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Helper to load DB
const getDb = (): Link[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

// Helper to save DB
const saveDb = (links: Link[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(links));
};

// API Methods (Simulated with Promises)

export const getLinks = async (): Promise<ApiResponse<Link[]>> => {
  await new Promise(resolve => setTimeout(resolve, DELAY_MS));
  const links = getDb().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return { status: 200, data: links };
};

export const getLinkByCode = async (code: string): Promise<ApiResponse<Link>> => {
  await new Promise(resolve => setTimeout(resolve, DELAY_MS));
  const links = getDb();
  const link = links.find(l => l.code === code);
  
  if (!link) {
    return { status: 404, error: 'Link not found' };
  }
  return { status: 200, data: link };
};

export const createLink = async (req: CreateLinkRequest): Promise<ApiResponse<Link>> => {
  await new Promise(resolve => setTimeout(resolve, DELAY_MS));
  const links = getDb();
  
  let code = req.code;

  // Validate custom code
  if (code) {
    if (links.some(l => l.code === code)) {
      return { status: 409, error: 'Short code already in use.' };
    }
  } else {
    // Generate unique code
    do {
      code = generateCode();
    } while (links.some(l => l.code === code));
  }

  const newLink: Link = {
    code: code!,
    originalUrl: req.url,
    createdAt: new Date().toISOString(),
    clicks: 0,
    lastClickedAt: null,
  };

  links.push(newLink);
  saveDb(links);

  return { status: 201, data: newLink };
};

export const deleteLink = async (code: string): Promise<ApiResponse<void>> => {
  await new Promise(resolve => setTimeout(resolve, DELAY_MS));
  let links = getDb();
  const initialLength = links.length;
  links = links.filter(l => l.code !== code);
  
  if (links.length === initialLength) {
    return { status: 404, error: 'Link not found' };
  }

  saveDb(links);
  return { status: 200 };
};

export const recordClick = async (code: string): Promise<ApiResponse<string>> => {
  // Note: Intentionally low delay for redirect speed
  const links = getDb();
  const linkIndex = links.findIndex(l => l.code === code);
  
  if (linkIndex === -1) {
    return { status: 404, error: 'Link not found' };
  }

  links[linkIndex].clicks += 1;
  links[linkIndex].lastClickedAt = new Date().toISOString();
  saveDb(links);

  return { status: 200, data: links[linkIndex].originalUrl };
};