// SPDX-License-Identifier: LGPL-3.0-or-later
// Copyright 2013 - UDS/CNRS
// The Aladin Lite program is distributed under the terms
// of the GNU Lesser General Public License version 3
// or (at your option) any later version.
//
// This file is part of Aladin Lite.
//
//    Aladin Lite is free software: you can redistribute it and/or modify
//    it under the terms of the GNU Lesser General Public License as published by
//    the Free Software Foundation, either version 3 of the License, or
//    (at your option) any later version.
//
//    Aladin Lite is distributed in the hope that it will be useful,
//    but WITHOUT ANY WARRANTY; without even the implied warranty of
//    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
//    GNU Lesser General Public License for more details.
//
//    You should have received a copy of the GNU Lesser General Public License
//    along with Aladin Lite. If not, see <https://www.gnu.org/licenses/>.
//

/******************************************************************************
 * Aladin Lite project
 *
 * File gui/Button/SkewerSelector.js
 *
 *
 * Author: Tom Donaldson [STScI]
 *
 *****************************************************************************/

import { ActionButton } from "../Widgets/ActionButton.js";
import skewerSelectionIcon from '../../../../assets/icons/skewer_selection_black.svg';
import { ALEvent } from "../../events/ALEvent.js";
import { View } from "../../View.js";

export class SkewerSelector extends ActionButton {
    // Constructor
    constructor(aladin) {
        let self;
        super({
            icon: {
                url: skewerSelectionIcon,
                monochrome: true,
            },
            classList: ['aladin-skewerSelector-control'],
            size: 'medium',
            tooltip: {
                content: 'Click inside shapes to select them.<br />Toggle selections with Ctrl or Cmd click.',
                // TSD tooltip positioning
                // position: { direction: 'top' },
                // position: { top: '-80%', bottom: '80%', left: '80%' },
                position: { top: '-100%', left: '80%' },
            },
            action(o) {
                if (self.mode !== View.TOOL_SKEWER_SELECTOR) {
                    aladin.fire('skewerselector');
                } else {
                    aladin.fire('default');
                }
            }
        })
        self = this;

        this.aladin = aladin;
        this.mode = aladin.view.mode;

        this.addListeners()
    }

    updateStatus() {
        if (this.mode === View.TOOL_SKEWER_SELECTOR) {
            if (this.aladin.statusBar) {
                this.aladin.statusBar.appendMessage({
                    id: 'skewerselector',
                    message: 'Skewer Mode',
                    type: 'info'
                })
            }
        } else {
            if (this.aladin.statusBar) {
                this.aladin.statusBar.removeMessage('skewerselector')
            }
        }

        this.update({toggled: this.mode === View.TOOL_SKEWER_SELECTOR})
    }

    addListeners() {
        ALEvent.MODE.listenedBy(this.aladin.aladinDiv, e => {
            let mode = e.detail.mode;
            this.mode = mode;

            this.updateStatus();
        });
    }
}
