'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

type Resource = {
  id: string;
  title: string;
  description: string | null;
  resourceType: string;
  resourceUrl: string;
  visibility: 'teacher' | 'student';
  attached: boolean;
};

type Props = {
  assignmentId: string;
  pathwaySlug: string;
  resources: Resource[];
};

const typeOptions = [
  ['slides', 'Slides'],
  ['worksheet', 'Worksheet'],
  ['exam_question', 'Exam question'],
  ['mark_scheme', 'Mark scheme'],
  ['model_answer', 'Model answer'],
  ['video', 'Video'],
  ['website', 'Website'],
  ['reading', 'Reading'],
  ['other', 'Other'],
] as const;

export default function LessonResourceManager({ assignmentId, pathwaySlug, resources }: Props) {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [resourceType, setResourceType] = useState('worksheet');
  const [resourceUrl, setResourceUrl] = useState('');
  const [visibility, setVisibility] = useState<'teacher' | 'student'>('student');
  const [busy, setBusy] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  async function createResource() {
    setBusy('create');
    setMessage('');
    try {
      const response = await fetch('/api/lesson-resources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pathwaySlug, title, description, resourceType, resourceUrl, visibility }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? 'Resource could not be created.');
      setTitle('');
      setDescription('');
      setResourceUrl('');
      setMessage('Resource added to this lesson.');
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Resource could not be created.');
    } finally {
      setBusy(null);
    }
  }

  async function toggleAttachment(resourceId: string, attached: boolean) {
    setBusy(resourceId);
    setMessage('');
    try {
      const response = await fetch(`/api/assignments/${assignmentId}/resources`, {
        method: attached ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resourceId }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? 'Attachment could not be updated.');
      setMessage(attached ? 'Resource removed from this assignment.' : 'Resource attached to this assignment.');
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Attachment could not be updated.');
    } finally {
      setBusy(null);
    }
  }

  return (
    <div style={{ display: 'grid', gap: 18 }}>
      <section style={{ display: 'grid', gap: 10 }}>
        <h4 style={{ margin: 0 }}>Add a lesson resource</h4>
        <label><span>Title</span><input value={title} onChange={(event) => setTitle(event.target.value)} /></label>
        <label><span>Description</span><textarea rows={3} value={description} onChange={(event) => setDescription(event.target.value)} /></label>
        <label><span>Type</span><select value={resourceType} onChange={(event) => setResourceType(event.target.value)}>{typeOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
        <label><span>Web or file link</span><input type="url" value={resourceUrl} onChange={(event) => setResourceUrl(event.target.value)} placeholder="https://…" /></label>
        <label><span>Visibility</span><select value={visibility} onChange={(event) => setVisibility(event.target.value as 'teacher' | 'student')}><option value="student">Students can open it when attached</option><option value="teacher">Teacher only</option></select></label>
        <button type="button" onClick={createResource} disabled={busy !== null || !title.trim() || !resourceUrl.trim()}>{busy === 'create' ? 'Adding…' : 'Add resource'}</button>
      </section>

      <section style={{ display: 'grid', gap: 10 }}>
        <h4 style={{ margin: 0 }}>Resources for this lesson</h4>
        {resources.length === 0 ? <p>No resources have been added to this lesson yet.</p> : resources.map((resource) => (
          <article key={resource.id} style={{ border: '1px solid rgba(213,226,235,.95)', borderRadius: 16, padding: 12, background: '#fff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'start' }}>
              <div><strong>{resource.title}</strong><p style={{ margin: '4px 0' }}>{resource.description || resource.resourceType.replaceAll('_', ' ')}</p><small>{resource.visibility === 'student' ? 'Student visible' : 'Teacher only'}</small></div>
              <a href={resource.resourceUrl} target="_blank" rel="noreferrer">Open</a>
            </div>
            <button type="button" style={{ marginTop: 10 }} onClick={() => toggleAttachment(resource.id, resource.attached)} disabled={busy !== null || resource.visibility === 'teacher'}>{busy === resource.id ? 'Saving…' : resource.attached ? 'Remove from assignment' : resource.visibility === 'teacher' ? 'Teacher-only resource' : 'Attach to assignment'}</button>
          </article>
        ))}
      </section>
      {message && <p role="status">{message}</p>}
    </div>
  );
}
