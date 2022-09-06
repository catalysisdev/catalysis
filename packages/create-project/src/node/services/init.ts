import { createProjectLogger } from '../logger.js'
import { hyphenCased } from '@gestaltjs/core/common/string'
import { joinPath, moduleDirname } from '@gestaltjs/core/node/path'
import {
  findPathUp,
  inTemporarydirectory,
  moveFileOrDirectory,
  pathExists,
  writeFile,
} from '@gestaltjs/core/node/fs'
import { Abort } from '@gestaltjs/core/common/error'
import { content, pathToken } from '@gestaltjs/core/node/logger'
import { getUsername } from '@gestaltjs/core/node/environment'
import { decodeJsonFile } from '@gestaltjs/core/node/json'

/**
 * An abort error that's thrown when the user tries to create a project and the directory
 * already exists.
 * @param directory {directory} The absolute path to the already-existing directory.
 * @returns {Abort} An abort error.
 */
export const ProjectDirectoryExistsError = (directory: string) => {
  return new Abort(
    content`The directory ${pathToken(directory)} already exists.`
  )
}

export type InitServiceOptions = {
  /**
   * When true, the generated project should have its Gestalt dependencies
   * pointing to the packages in the repository.
   */
  local: boolean

  /**
   * The name of the project as it was passed by the user through flags or
   * the prompt.
   */
  name: string

  /**
   * The directory where the project's directory will get created.
   */
  directory: string

  /**
   * The package manager to use to install dependencies
   */
  packageManager?: string
}

export async function initService(options: InitServiceOptions) {
  const projectDirectory = joinPath(options.directory)
  await ensureProjectDirectoryAbsence(projectDirectory)
  await inTemporarydirectory(async (temporaryDirectory) => {
    await initPackageJson(temporaryDirectory, options)
    await initREADME(temporaryDirectory, options)
    await moveFileOrDirectory(temporaryDirectory, projectDirectory)
  })
  createProjectLogger().info('it works!')
}

/**
 * It throws an error if the project directory already exists in the system.
 * @param directory {string} Absolute path to the project directory.
 * @throws {ProjectDirectoryExistsError} If the directory already exists.
 */
export async function ensureProjectDirectoryAbsence(directory: string) {
  if (await pathExists(directory)) {
    throw ProjectDirectoryExistsError(directory)
  }
}

export async function initPackageJson(
  directory: string,
  options: InitServiceOptions
) {
  let packageJson: any = {
    name: hyphenCased(options.name),
    private: true,
    license: 'UNLICENSED',
    scripts: {
      dev: 'gestalt dev',
      build: 'gestalt build',
      test: 'gestalt test',
      check: 'gestalt check',
      generate: 'gestalt generate',
      info: 'gestalt info',
      routes: 'gestalt routes',
    },
    dependencies: {
      gestaltjs: await getVersion(),
    },
    author: await getUsername(),
  }
  if (options.local) {
    const overrides = {
      gestaltjs: `file:/`,
    }
    packageJson = {
      ...packageJson,
      resolutions: overrides,
      overrides: overrides,
    }
  }

  const packageJsonPath = joinPath(directory, 'package.json')
  await writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2))
}

export async function initREADME(
  directory: string,
  options: InitServiceOptions
) {}

/**
 * It returns the version of the gestaltjs dependency that should be use.
 * NOTE that the logic in this function assumes that the dependencies
 * between the packages in this repository is strict and that they are all
 * versioned togehter. If that assumption breaks, we might end up generating
 * projects that point to old versions of gestaltjs.
 *
 * An assumption-free implementation of this function could read the version
 * from the gestaltjs package's package.json at build time, but because we are
 * using the Typescript compiler, we can't do that. We'd need to introduce
 * a transpiler like Babel.
 * @returns {string}
 */
export async function getVersion(): Promise<string> {
  const packageJsonPath = (await findPathUp('package.json', {
    type: 'file',
    cwd: moduleDirname(import.meta.url),
  })) as string
  const { version } = await decodeJsonFile(packageJsonPath)
  return version
}
