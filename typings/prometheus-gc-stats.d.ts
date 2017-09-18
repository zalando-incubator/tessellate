// Type definitions for prometheus-gc-stats 0.3.x
// Project: https://github.com/SimenB/node-prometheus-gc-stats
// Definitions by: mfellner <https://github.com/mfellner>

declare module 'prometheus-gc-stats' {
  export = PrometheusGcStats;

  function PrometheusGcStats(): () => void;
}
