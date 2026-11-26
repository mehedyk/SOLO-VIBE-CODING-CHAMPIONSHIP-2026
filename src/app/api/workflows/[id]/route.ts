import { NextRequest, NextResponse } from 'next/server';
import { authorizeRequest } from '@/lib/auth/guard';
import { getWorkflow } from '@/lib/workflow/publisher';
import { apiError } from '@/lib/http';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await authorizeRequest(req, 'lesson:publish', { resourceType: 'workflow' });
    if (!auth.allowed) return apiError(auth.status || 403, auth.error || 'FORBIDDEN');

    const { id } = await params;
    const workflow = await getWorkflow(id);
    if (!workflow) {
      return NextResponse.json({ error: 'NOT_FOUND' }, { status: 404 });
    }
    return NextResponse.json({ workflow });
  } catch (err: any) {
    return apiError(500, 'SERVER_ERROR', undefined, err);
  }
}
