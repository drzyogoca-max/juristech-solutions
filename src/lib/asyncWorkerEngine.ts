export async function runAsyncChunkedTask<T>(
  items: T[],
  chunkSize = 50,
  processor: (chunk: T[]) => Promise<void>
): Promise<void> {
  for (let i = 0; i < items.length; i += chunkSize) {
    const chunk = items.slice(i, i + chunkSize);
    await processor(chunk);
    // Yield to main event loop to keep UI thread 60fps responsive
    await new Promise((resolve) => setTimeout(resolve, 0));
  }
}

export function deferToNextTick(callback: () => void): void {
  if (typeof requestIdleCallback !== 'undefined') {
    requestIdleCallback(() => callback());
  } else {
    setTimeout(callback, 0);
  }
}
