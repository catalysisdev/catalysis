import { createPluginLogger } from '../../../private/logger.js'
import { globalFlags } from '@gestaltjs/core/node/command'
import { Command } from '@oclif/core'

// eslint-disable-next-line import/no-default-export
export default class Init extends Command {
  static description = 'Create a Gestalt plugin'

  static flags = {
    ...globalFlags(),
  }

  async run(): Promise<void> {
    createPluginLogger().info('Plugin created')
  }
}
