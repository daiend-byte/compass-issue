/** API 呼び出しで発生したエラーを表す。UI 側はこれを捕捉して通信エラーダイアログを表示する。 */
export class ApiError extends Error {
  readonly status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

/**
 * JSON を取得する薄い fetch ラッパ。
 * - ネットワーク到達不可・非 2xx を {@link ApiError} に正規化する。
 * - サーバが返す `{ "error": "..." }` の文言があれば保持する。
 */
export async function getJson(url: string, signal?: AbortSignal): Promise<unknown> {
  let response: Response;
  try {
    response = await fetch(url, { signal });
  } catch {
    throw new ApiError('ネットワークに接続できませんでした');
  }

  if (!response.ok) {
    let detail = '';
    try {
      const body: unknown = await response.json();
      if (body && typeof body === 'object' && 'error' in body && typeof body.error === 'string') {
        detail = body.error;
      }
    } catch {
      // ボディが JSON でない場合は無視してステータスのみで通知する
    }
    throw new ApiError(
      detail || `リクエストに失敗しました (HTTP ${response.status})`,
      response.status,
    );
  }

  return response.json();
}
