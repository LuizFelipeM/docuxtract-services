export class StackTraceUtil {
  static getCallerFile(): string | undefined {
    const stack = new Error().stack;

    if (!stack) {
      return undefined;
    }

    const stackLines = stack.split('\n');

    // Find the caller line (exclude the first line, which is the current method)
    // The exact index may vary; here we assume the second stack frame (index 2) is the caller.
    const callerLine = stackLines[3]; // Adjust based on the stack format.

    if (!callerLine) {
      return undefined;
    }

    // Extract the file path using regex
    const match =
      callerLine.match(/\((.*):\d+:\d+\)$/) ||
      callerLine.match(/at (.*):\d+:\d+$/);

    return match ? match[1] : undefined;
  }
}
