import { parseCliArgs, printHelp, validateArgs } from './args.js';
import { fetchContributions } from '../github/index.js';
import { renderDashboard } from '../display/index.js';
import { bold } from '../display/colors.js';

export async function run(argv = process.argv.slice(2)) {
  const args = parseCliArgs(argv);

  if (args.help) {
    printHelp();
    return 0;
  }

  const errors = validateArgs(args);
  if (errors.length > 0) {
    for (const err of errors) {
      console.error(`${bold('Error:')} ${err}`);
    }
    console.error('');
    printHelp();
    return 1;
  }

  try {
    process.stdout.write('Fetching contributions...');

    const data = await fetchContributions({
      username: args.user,
      token: args.token,
      days: args.days,
      useCache: !args.noCache,
    });

    process.stdout.write('\r\x1b[K');

    const output = renderDashboard(data, { days: args.days });
    console.log(output);
    return 0;
  } catch (err) {
    process.stdout.write('\r\x1b[K');
    console.error(`${bold('Error:')} ${err.message}`);
    if (process.env.DEBUG) {
      console.error(err.stack);
    }
    return 1;
  }
}
