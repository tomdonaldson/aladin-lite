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
import { SkewerSelector } from "../Button/SkewerSelector.js";
import helpIconBtn from '../../../../assets/icons/help.svg';
import { Utils } from "../../Utils";
import { GridSettingsCtxMenu } from "./../CtxMenu/GridSettings.js";
import { CtxMenuActionButtonOpener } from "./CtxMenuOpener";
import skewerSelectionIcon from '../../../../assets/icons/skewer_selection-arrow.svg';
import edgeSelectionIcon from '../../../../assets/icons/edge_selection-arrow.svg';
import { SimbadPointer } from "./SimbadPointer.js";
import { GridEnabler } from "./GridEnabler.js";
import { Stack } from "./Stack.js";
import { ColorPicker } from "./ColorPicker.js";
import { ShareActionButton } from "./ShareView.js";

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
        super({
            icon: {
                size: 'medium',
                monochrome: true,
                url: edgeSelectionIcon
            },
            classList: ['aladin-selectionMode-control'],
            tooltip: {
                content: 'Choose the selection mode',
                position: { direction: 'top' },
            },
            ctxMenu: undefined,
            ...options
        }, aladin);

        this.aladin = aladin;
        let ctxMenu = this._buildLayout()
        this.update({ctxMenu})
    }

    setCustomIcon(icon) {
        // if (this?.el?.firstElementChild?.firstElementChild?.src) {
        //     this.el.firstElementChild.firstElementChild.src  = icon;
        // }
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
            {
                label: {
                    content: [skewerEnableBtn, 'Skewer Selection']
                },
            },
            {
                label: {
                    content: [skewerDisableBtn, 'Edge Selection']
                },
            },
        ]
    }

}

