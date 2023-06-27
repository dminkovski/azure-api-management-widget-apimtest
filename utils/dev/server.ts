import fs from 'fs';
import path from 'path'

const template = fs.readFileSync(
  path.resolve('./utils/dev/template.html'),
  'utf-8',
)

export function render(url: string): string {
  //return `<body style="margin: auto;text-align: center;"><script type="module" src="/src/wrapper.js"></script><title>Widget-Wrapper</title><iframe allow="${iframeSandboxAllows}" style="width:${width};height:${height}" src="http//:localhost:${port}?${params}" /></body>`
  return template;
}
