import { project as projectModule, terminal } from '@gestaltjs/core/cli'
import { path } from '@gestaltjs/core/cli'

type PrettyFormatOptions = {
  project: projectModule.models.Project
}

export function prettyFormat(options: PrettyFormatOptions): string {
  const lines: string[] = []
  lines.push(terminal.formatGreen(terminal.formatBold('Project')))
  lines.push(
    `  ${terminal.formatBold('Name:')} ${options.project.configuration.name}`
  )
  lines.push(
    `  ${terminal.formatBold('Directory:')} ${path.relativize(
      options.project.directory
    )}`
  )
  lines.push(
    `  ${terminal.formatBold('Manifest:')} ${path.relativize(
      options.project.configuration.manifestPath
    )}`
  )
  lines.push(``)

  const plugins = options.project.configuration.plugins ?? []
  if (plugins.length !== 0) {
    lines.push(terminal.formatGreen(terminal.formatBold('Plugins 🌱')))
    plugins.forEach((plugin) => {
      lines.push(
        `  ${terminal.formatBold(`${plugin.name}:`)}: ${plugin.description}`
      )
    })
    lines.push('')
  }

  const mainTargets = options.project.targets.main
  if (
    Object.keys(mainTargets).length !== 0 ||
    Object.keys(mainTargets).length !== 0
  ) {
    lines.push(terminal.formatGreen(terminal.formatBold('Targets 📦')))
  }
  if (Object.keys(mainTargets).length !== 0) {
    lines.push(`    ${terminal.formatCyan(terminal.formatBold('Main'))}`)
    Object.keys(mainTargets).forEach((targetName) => {
      const target = mainTargets[targetName]
      const targetPrefix = `      `
      const targetMetadataPrefix = `        `
      lines.push(
        `${targetPrefix}${terminal.formatYellow(
          terminal.formatBold(`${targetName} [${target.platforms.join(',')}]`)
        )}`
      )
      lines.push(
        `${targetMetadataPrefix}${terminal.formatBold(
          `Directory:`
        )} ${path.relativize(target.directory)}`
      )
      lines.push(
        `${targetMetadataPrefix}${terminal.formatBold(
          `Manifest:`
        )} ${path.relativize(target.manifestPath)}`
      )
    })
  }

  lines.push(``)
  return lines.join('\n')
}
