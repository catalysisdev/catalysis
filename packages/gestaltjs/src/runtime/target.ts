import { UserMainTarget } from '@gestaltjs/core/common/manifests'
export { useContext } from '@gestaltjs/core/common/context'

type UserMainTargetExport =
  | UserMainTarget
  | (() => Promise<UserMainTarget>)
  | (() => UserMainTarget)

/**
 * A utility function to define a main target target. Since the function has its argument and
 * return value typed, when using it from the target default module, editors will
 * offer a better editing experience with syntax highlighting, validation, documentation,
 * and auto-completion.
 *
 * Alternatively, targets can use the '@type' annotation:
 *   @type {import('gestaltjs/target').UserMainTarget}
 *   const target = {...}
 *
 * @param target {Target | () => Promise<UserMainTarget> | () => UserMainTarget} Define a new target.
 * @returns A promise that resolves with the target.
 */
export function defineUserMainTarget(
  target: UserMainTargetExport
): UserMainTargetExport {
  return target
}
