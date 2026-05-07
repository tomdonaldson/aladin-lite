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
 * File gui/Button/SkewerDisableMenu.js
 *
 *
 * Author: Tom Donaldson [STScI]
 *
 *****************************************************************************/

import { ActionButton } from "../Widgets/ActionButton.js";
import edgeSelectionIcon from '../../../../assets/icons/edge_selection.svg';
import { ALEvent } from "../../events/ALEvent.js";
import { View } from "../../View.js";

// TSD change the name of these?
export class SkewerDisableMenu extends ActionButton {
    // Constructor
    constructor(aladin, options) {
        let self;
        super({
            icon: {
                url: edgeSelectionIcon,
                monochrome: true,
            },
            classList: ['aladin-skewerSelector-control'],
            size: 'medium',
            tooltip: {
                content: 'Click on objects to select them.<br />Toggle selections with Ctrl or Cmd click.',
                position: { direction: 'top right' },
            },
            action(o) {
                aladin.fire('default');
                if (self.onClick) {
                    self.onClick();
                }
            }
        })
        self = this;
        self.onClick = options.onClick;

        this.aladin = aladin;  // TSD needed?
        this.mode = aladin.view.mode;  // TSD needed?
    }
}
