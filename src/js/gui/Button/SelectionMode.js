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

import { Layout } from "../Layout.js";
import { Input } from "../Widgets/Input.js";
import { Color } from "../../Color.js";
import { ALEvent } from "../../events/ALEvent.js";
import { SAMPActionButton } from "../Button/SAMP.js";
import { SkewerSelectorMenu } from "../Button/SkewerSelectorMenu.js";
import { SkewerDisableMenu } from "../Button/SkewerDisableMenu.js";
import helpIconBtn from '../../../../assets/icons/help.svg';
import { Utils } from "../../Utils";
import { GridSettingsCtxMenu } from "./../CtxMenu/GridSettings.js";
import { CtxMenuActionButtonOpener } from "./CtxMenuOpener";
import skewerSelectionIconArrow from '../../../../assets/icons/skewer_selection-arrow.svg';
import skewerSelectionIcon from '../../../../assets/icons/skewer_selection_black.svg';
import edgeSelectionIconArrow from '../../../../assets/icons/edge_selection-arrow.svg';
import edgeSelectionIcon from '../../../../assets/icons/edge_selection.svg';
import { SimbadPointer } from "./SimbadPointer.js";
import { GridEnabler } from "./GridEnabler.js";
import { Stack } from "./Stack.js";
import { ColorPicker } from "./ColorPicker.js";
import { ShareActionButton } from "./ShareView.js";


import addIconUrl from "../../../../assets/icons/plus.svg";

/******************************************************************************
 * Aladin Lite project
 *
 * File gui/Button/SelectionMode.js
 *
 * A context menu that shows when the user right clicks, or long touch on touch device
 *
 *
 * Author: Tom Donaldson (STScI)
 *
 *****************************************************************************/
/**
 * Class representing a Tabs layout
 * @extends CtxMenuActionButtonOpener
 */
 export class SelectionMode extends CtxMenuActionButtonOpener {
    /**
     * UI responsible for displaying the viewport infos
     * @param {Aladin} aladin - The aladin instance.
     */
    constructor(aladin, options) {

        // If we're on Mac, the modifier key will be Cmd instead of Ctrl.
        let modifierKey = 'Ctrl';
        const userAgent = window.navigator.userAgent.toLowerCase();
        if (userAgent.indexOf('mac') > -1) {
            modifierKey = 'Cmd';
        }

        super({
            icon: {
                size: 'medium',
                monochrome: true,
                url: edgeSelectionIconArrow
            },
            classList: ['aladin-selectionMode-control'],
            tooltip: {
                content: 'Choose the selection mode<br />(' + modifierKey + ' for multiselect)',
                position: { direction: 'top right', top: '10%', left: '80%' },
            },
            ctxMenu: undefined,
            ...options
        }, aladin);

        this.aladin = aladin;
        this.modifierKey = modifierKey;
        let ctxMenu = this._buildLayout()
        this.update({ctxMenu})
    }

    setCustomIcon(icon) {
        this.update({icon: {
                size: 'medium',
                monochrome: true,
                url: icon
            }})
    }

    _buildLayout() {
        let self = this;
        let aladin = this.aladin;

        let skewerEnableBtn = new SkewerSelectorMenu(aladin, {
            onClick: () => {
                console.log('TSD skewer enable clicked!!' + self)
                self.setCustomIcon(skewerSelectionIcon)
            }});
        let skewerDisableBtn = new SkewerDisableMenu(aladin, {
            onClick: () => {
                console.log('TSD skewer disable clicked!!' + self)
                self.setCustomIcon(edgeSelectionIcon)
            }});

        return [
            // {
            //     label: {
            //         content: [skewerEnableBtn /*, 'Skewer Selection'*/]
            //     },
            // },
            // {
            //     label: {
            //         content: [skewerDisableBtn, 'Edge Selection']
            //     },
            // },
            {
                label: {
                    icon: {
                        url: skewerSelectionIcon,
                        monochrome: true,
                    },
                    tooltip: {
                        content: 'Click inside shapes to select.<br />Multiselect with ' + self.modifierKey + '.',
                        position: { direction: 'top right', left: '50%' },
                    },
                    content: "Skewer Selection",
                },
                action: (e) => {
                    aladin.fire('skewerselector');
                    console.log('TSD skewer enable clicked!!' + self)
                    self.setCustomIcon(skewerSelectionIconArrow)
                },
            },
            {
                label: {
                    icon: {
                        url: edgeSelectionIcon,
                        monochrome: true,
                    },
                    tooltip: {
                        content: 'Click on objects to select.<br />Multiselect with ' + self.modifierKey + '.',
                        position: { direction: 'top right', left: '60%' },
                    },
                    content: "Edge Selection",
                },
                action: (e) => {
                    aladin.fire('default');
                console.log('TSD skewer disable clicked!!' + self)
                self.setCustomIcon(edgeSelectionIconArrow)
                },
            },
        ]
    }

}

