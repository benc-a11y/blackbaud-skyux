import { StaticProvider } from '@angular/core';

// TODO: defaults won't show in the generated docs until this work is done:
// https://github.com/blackbaud/skyux-docs-tools/issues/38

/**
 * Specifies configuration options for creating a modal.
 */
export interface SkyModalConfigurationInterface {
  /**
   * Whether to display the modal full screen.
   * This property defaults to `false`.
   */
  fullPage?: boolean;

  /**
   * The size for the modal. The valid options are `small`, `medium`, and `large`.
   * This property defaults to `medium`.
   */
  size?: string;

  /**
   * An array property of `providers`.
   * In Angular, a provider is something that can create or deliver a service.
   * This property can be used to pass context values from the component that launches the modal to the modal component.
   */
  providers?: StaticProvider[];


  /**
   * The ARIA role for the modal
   * [to support accessibility](https://developer.blackbaud.com/skyux/learn/accessibility)
   * by indicating how the modal functions and what it controls. For information about
   * how an ARIA role indicates what an item represents on a web page, see the
   * [WAI-ARIA roles model](http://www.w3.org/WAI/PF/aria/#roles). By default, modals set
   * the ARIA role to `dialog`.
   * @default "dialog"
   */
  ariaRole?: string;


  /**
   * The CSS class to add to the modal, such as `ag-custom-component-popup` for
   * using a modal as part of a cell editor in Data Entry Grid.
   */
  wrapperClass?: string;
}
