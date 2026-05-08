export class Brp {
    get version() {
        return 2;
    }

    get id() {
        return "brp";
    }

    async actorRollSkill(actor, skillId) {
        // BRP skills are items of type "skill"
        let skill = actor.items.get(skillId);
        
        if (!skill) {
            // Try to find by name (case insensitive)
            skill = actor.items.find(i => 
                i.type === "skill" && 
                (i.name.toLowerCase().trim() === skillId.toLowerCase().trim() || 
                 i.id === skillId)
            );
        }

        if (skill && typeof skill.roll === "function") {
            const message = await skill.roll();
            if (!message) return null;
            return Array.isArray(message.rolls) ? message.rolls[0] : message;
        }

        // Fallback d100 roll
        console.warn(`BRP BSA: Could not find roll method for skill \"${skillId}\", using fallback d100 roll`);
        const roll = new Roll("1d100");
        await roll.evaluate();
        return roll;
    }

    async actorRollAbility(actor, abilityId) {
        const char = actor.system?.characteristics?.[abilityId];
        if (char) {
            const target = (char.value || char.base || 10) * 5;
            const roll = new Roll("1d100");
            await roll.evaluate();
            roll.options = { ...roll.options, target: target, success: roll.total <= target };
            return roll;
        }
        console.warn(`BRP BSA: Characteristic \"${abilityId}\" not found`);
        return null;
    }

    async actorRollTool(actor, item) {
        if (item && typeof item.roll === "function") {
            const message = await item.roll();
            if (!message) return null;
            return Array.isArray(message.rolls) ? message.rolls[0] : message;
        }
        return null;
    }

    actorCurrenciesGet(actor) {
        const wealth = actor.system?.wealthValue ?? actor.system?.wealth ?? 0;
        return { "wealth": wealth };
    }

    async actorCurrenciesStore(actor, currencies) {
        const updateData = {};
        if (currencies.wealth !== undefined) {
            updateData["system.wealthValue"] = currencies.wealth;
            updateData["system.wealth"] = currencies.wealth;
        }
        if (Object.keys(updateData).length > 0) {
            await actor.update(updateData);
        }
    }

    actorSheetAddTab(sheet, html, actor, tabData, tabBody) {
        const tabs = $(html).find('nav[data-group="primary"], .tabs[data-group="primary"]');
        const tabItem = $(`<a class="item" data-tab="${tabData.id}" title="${tabData.label}">${tabData.html}</a>`);
        tabs.append(tabItem);
        const body = $(html).find(".primary-body, .sheet-body");
        const tabContent = $(`<div class="tab flexcol" data-group="primary" data-tab="${tabData.id}"></div>`);
        body.append(tabContent);
        tabContent.append(tabBody);
    }

    get actorSheetTabSelector() {
        return 'nav[data-group="primary"] [data-tab], .tabs[data-group="primary"] [data-tab]';
    }

    itemSheetReplaceContent(app, html, element) {
        html.find('.sheet-navigation').remove();
        const properties = html.find('.item-properties').clone();
        const sheetBody = html.find('.primary-body, .sheet-body');
        sheetBody.addClass("flexrow");
        sheetBody.empty();
        sheetBody.append(properties);
        sheetBody.append(element);
    }

    get configSkills() {
        // Return common BRP skills + any custom ones if we add settings later
        const commonSkills = [
            "Appraise", "Art", "Bargain", "Brawl", "Climb", "Command", "Conceal", "Craft",
            "Demolitions", "Disguise", "Dodge", "Drive", "Etiquette", "Fast Talk", "Fine Manipulation",
            "First Aid", "Gaming", "Hide", "Insight", "Jump", "Knowledge", "Listen", "Lockpick",
            "Martial Arts", "Medicine", "Navigate", "Operate Heavy Machine", "Other Language",
            "Own Language", "Persuade", "Pilot", "Projection", "Psychology", "Research", "Ride",
            "Science", "Sense", "Sleight of Hand", "Spot Hidden", "Status", "Stealth", "Strategy",
            "Swim", "Teach", "Throw", "Track"
        ];
        return commonSkills.map(skill => ({
            id: skill.toLowerCase().replace(/\s+/g, ''),
            label: skill
        }));
    }

    get configAbilities() {
        return [
            { id: "str", label: "STR" },
            { id: "con", label: "CON" },
            { id: "int", label: "INT" },
            { id: "siz", label: "SIZ" },
            { id: "pow", label: "POW" },
            { id: "dex", label: "DEX" },
            { id: "cha", label: "CHA" },
            { id: "edu", label: "EDU" }
        ];
    }

    get configCurrencies() {
        return [
            { id: "wealth", label: "Wealth", factor: 1 }
        ];
    }

    get configCanRollAbility() {
        return true;
    }

    get configLootItemType() {
        return "gear";
    }

    get itemPriceAttribute() {
        return "system.price";
    }

    get itemQuantityAttribute() {
        return "system.quantity";
    }
}
