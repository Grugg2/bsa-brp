const Brp = class {
    get version() {
        return 2;
    }

    get id() {
        return "brp";
    }

    async actorRollSkill(actor, skillId) {
        let skill = actor.items.get(skillId);
        if (!skill) {
            skill = actor.items.find(i => 
                (i.name.toLowerCase() === skillId.toLowerCase() || i.id === skillId) && i.type === "skill"
            );
        }
        if (skill && typeof skill.roll === "function") {
            let roll = await skill.roll();
            if (Array.isArray(roll)) {
                roll = roll[0];
            }
            return roll;
        }
        console.warn(`BRP BSA: Could not find roll method for skill ${skillId}, using fallback d100 roll`);
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
        console.warn(`BRP BSA: Characteristic ${abilityId} not found`);
        return null;
    }

    async actorRollTool(actor, item) {
        if (item && typeof item.roll === "function") {
            let roll = await item.roll();
            if (Array.isArray(roll)) roll = roll[0];
            return roll;
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
        const tabs = $(html).find('.tabs[data-group="primary"], .sheet-tabs, nav.tabs');
        if (tabs.length > 0) {
            const tabItem = $(`<a class="item" data-tab="${tabData.id}">${tabData.label}</a>`);
            tabs.append(tabItem);
            const body = $(html).find('.sheet-body, .window-content');
            const tabContent = $(`<div class="tab" data-group="primary" data-tab="${tabData.id}"></div>`);
            body.append(tabContent);
            tabContent.append(tabBody);
        } else {
            $(html).find('.window-content').append(tabBody);
        }
    }

    get configSkills() {
        const commonSkills = [
            "Appraise", "Art", "Bargain", "Brawl", "Climb", "Command", "Conceal", "Craft", 
            "Demolitions", "Disguise", "Dodge", "Drive", "Etiquette", "Fast Talk", "Fine Manipulation",
            "First Aid", "Gaming", "Hide", "Insight", "Jump", "Knowledge", "Listen", "Lockpick",
            "Martial Arts", "Medicine", "Navigate", "Operate Heavy Machine", "Other Language", 
            "Own Language", "Persuade", "Pilot", "Projection", "Psychology", "Research", "Ride",
            "Science", "Sense", "Sleight of Hand", "Spot Hidden", "Status", "Stealth", "Strategy",
            "Swim", "Teach", "Throw", "Track"
        ];
        return commonSkills.map(skill => ({ id: skill.toLowerCase().replace(/\s+/g, ''), label: skill }));
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

    itemSheetReplaceContent(app, html, element) {
        const sheetBody = $(html).find('.sheet-body, .window-content');
        if (sheetBody.length) {
            sheetBody.empty();
            sheetBody.append(element);
        }
    }
};

Hooks.on("beavers-system-interface.init", async function(){
    beaversSystemInterface.register(new Brp());
});