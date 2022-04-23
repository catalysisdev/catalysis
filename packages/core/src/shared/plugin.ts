import { UserRenderer } from './renderer'

/**
 * The interface represents a Gestalt plugin. Plugins extend, augment, or replace Gestalt's
 * functionality, and also add new functionality.
 */
export type UserPlugin = {
  /**
   * A renderer integrates Gestalt with UI technologies like React or Svelte.
   */
  renderer?: UserRenderer
}
