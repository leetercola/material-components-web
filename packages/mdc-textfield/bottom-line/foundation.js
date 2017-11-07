/**
 * @license
 * Copyright 2016 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import MDCFoundation from '@material/base/foundation';
import MDCTextfieldBottomLineAdapter from './adapter';
import {cssClasses} from './constants';


/**
 * @extends {MDCFoundation<!MDCTextfieldBottomLineAdapter>}
 * @final
 */
class MDCTextfieldBottomLineFoundation extends MDCFoundation {
  /** @return enum {string} */
  static get cssClasses() {
    return cssClasses;
  }

  /**
   * {@see MDCTextfieldBottomLineAdapter} for typing information on parameters and return
   * types.
   * @return {!MDCTextfieldBottomLineAdapter}
   */
  static get defaultAdapter() {
    return /** @type {!MDCTextfieldBottomLineAdapter} */ ({
      addClassToBottomLine: () => {},
      removeClassFromBottomLine: () => {},
      registerTransitionEndHandler: () => {},
      deregisterTransitionEndHandler: () => {},
      setBottomLineAttr: () => {},
    });
  }

  /**
   * @param {!MDCTextfieldBottomLineAdapter=} adapter
   */
  constructor(adapter = /** @type {!MDCTextfieldBottomLineAdapter} */ ({})) {
    super(Object.assign(MDCTextfieldBottomLineFoundation.defaultAdapter, adapter));

    /** @private {function(!Event): undefined} */
    this.transitionEndHandler_ = (evt) => this.transitionEnd_(evt);
  }

  init() {
    this.adapter_.registerTransitionEndHandler(this.transitionEndHandler_);
  }

  destroy() {
    this.adapter_.deregisterTransitionEndHandler(this.transitionEndHandler_);
  }

  /**
   * Activates the text field focus state.
   * @private
   */
  activateFocus() {
    this.adapter_.addClassToBottomLine(cssClasses.BOTTOM_LINE_ACTIVE);
  }

  /**
   * Sets the transform-origin of the bottom line, causing it to animate out
   * from the user's click location.
   * @param {!Event} evt
   * @private
   */
  setBottomLineTransformOrigin(evt) {
    const targetClientRect = evt.target.getBoundingClientRect();
    const evtCoords = {x: evt.clientX, y: evt.clientY};
    const normalizedX = evtCoords.x - targetClientRect.left;
    const attributeString =
      `transform-origin: ${normalizedX}px center`;

    this.adapter_.setBottomLineAttr('style', attributeString);
  }

  /**
   * Fires when animation transition ends, performing actions that must wait
   * for animations to finish.
   * @param {!Event} evt
   * @private
   */
  transitionEnd_(evt) {
    // We need to wait for the bottom line to be entirely transparent
    // before removing the class. If we do not, we see the line start to
    // scale down before disappearing
    if (evt.propertyName === 'opacity' && !this.isFocused_) {
      this.adapter_.removeClassFromBottomLine(cssClasses.BOTTOM_LINE_ACTIVE);
    }
  }
}

export default MDCTextfieldBottomLineFoundation;
