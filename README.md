# gitpulse

> Lightweight dashboard to visualize your GitHub contribution patterns in the terminal

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D14.0.0-green.svg)

---

## Installation

```bash
npm install -g gitpulse
```

---

## Usage

Run `gitpulse` followed by a GitHub username to display their contribution dashboard:

```bash
gitpulse --user octocat
```

**Options:**

| Flag | Description |
|------|-------------|
| `--user <username>` | GitHub username to inspect |
| `--weeks <n>` | Number of weeks to display (default: `24`) |
| `--token <token>` | GitHub personal access token for higher rate limits |
| `--no-color` | Disable colored output |

**Example output:**

```
octocat — contributions (last 24 weeks)
████░░██████░░░███████████░░████  streak: 14 days
Total: 312  |  Avg/day: 2.1  |  Peak: 18 on 2024-03-04
```

---

## Authentication

To avoid GitHub API rate limits, set your personal access token:

```bash
export GITHUB_TOKEN=your_token_here
gitpulse --user octocat
```

---

## Requirements

- Node.js `>= 14.0.0`
- A GitHub account or personal access token

---

## License

[MIT](./LICENSE) © gitpulse contributors