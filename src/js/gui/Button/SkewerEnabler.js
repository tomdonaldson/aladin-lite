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
 * File gui/Stack/SkewerEnabler.js
 *
 *
 * Author: Tom Donaldson [STScI]
 *
 *****************************************************************************/

import { ActionButton } from "../Widgets/ActionButton.js";
import skewerIcon from './../../../../assets/icons/skewer_selection_black.svg';

export class SkewerEnabler extends ActionButton {
    // Constructor
    constructor(aladin) {
        const computeTooltip = (enabled) => {
            const content = enabled ? 'Disable skewer selection mode' : 'Enable skewer selection of footprints'
            return {
                content,
                position: {
                    direction: 'top right'
                }
            }
        }

        let self;
        super({
            icon: {
                size: 'medium',
                monochrome: true,
                url: skewerIcon
            },
            classList: ['aladin-skewer-control'],  // TSD
            tooltip: computeTooltip(false),
            toggled: false,
            action(o) {
                const isSkewerEnabled = aladin.getSkewerEnabled();
                const enabled = !isSkewerEnabled;
                aladin.setSkewerEnabled(enabled);

                self.update({toggled: enabled, tooltip: computeTooltip(enabled)})

                if (aladin.statusBar) {
                    aladin.statusBar.removeMessage('skewer')  // TSD - mimic what happens for region selections

                    // TSD figure out how to access onclick behavior without taking up the only onclick function.

                    if (enabled) {
                        aladin.statusBar.appendMessage({
                            id: 'skewer',
                            message: 'Skewer enabled!',
                            duration: 2000,
                            type: 'info'
                        })
                    }
                }
            }
        })
        self = this;
    }
}