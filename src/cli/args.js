import { parseArgs } from 'node:util';

const OPTIONS = {
  user: {
    type: 'string',
    short: 'u',
    description: 'GitHub username to fetch contributions for',
  },
  token: {
    type: 'string',
    short: 't',
    description: 'GitHub personal access token',
  },
  days: {
    type: 'string',
    short: 'd',
    default: '90',
    description: 'Number of days to look back (default: 90)',
  },
  'no-cache': {
    type: 'boolean',
    default: false,
    description: 'Skip reading from cache',
  },
  help: {
    type: 'boolean',
    short: 'h',
    default: false,
    description: 'Show help message',
  },
};

export function parseCliArgs(argv = process.argv.slice(2)) {
  const { values } = parseArgs({ args: argv, options: OPTIONS, strict: false });
  return {
    user: values.user ?? process.env.GITHUB_USER ?? null,
    token: values.token ?? process.env.GITHUB_TOKEN ?? null,
    days: Math.max(1, Math.min(365, parseInt(values.days, 10) || 90)),
    noCache: values['no-cache'] ?? false,
    help: values.help ?? false,
  };
}

export function printHelp() {
  const lines = [
    'Usage: gitpulse [options]',
    '',
    'Options:',
    ...Object.entries(OPTIONS).map(([name, opt]) => {
      const short = opt.short ? `-${opt.short}, ` : '    ';
      const flag = `  ${short}--${name.padEnd(12)}`;
      const def = opt.default !== undefined ? ` (default: ${opt.default})` : '';
      return `${flag}  ${opt.description}${def}`;
    }),
  ];
  console.log(lines.join('\n'));
}

export function validateArgs(args) {
  const errors = [];
  if (!args.user) errors.push('GitHub username is required. Use --user or set GITHUB_USER env var.');
  if (!args.token) errors.push('GitHub token is required. Use --token or set GITHUB_TOKEN env var.');
  return errors;
}
