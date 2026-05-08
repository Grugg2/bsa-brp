class AbilityTest {
    constructor() {
        this.type = "AbilityTest";
        this._choices = {};
        this.informationField = {
            name: "type",
            type: "info",
            label: game['i18n'].localize("beaversSystemInterface.tests.abilityTest.info.label"),
            note: game['i18n'].localize("beaversSystemInterface.tests.abilityTest.info.note")
        };
        this._choices = beaversSystemInterface.configAbilities.reduce((object, ability) => {
            object[ability.id] = { text: ability.label };
            return object;
        }, {});
    }

    create(data) {
        const result = new AbilityTestCustomized();
        result.data = data;
        result.parent = this;
        return result;
    }

    get customizationFields() {
        return {
            ability: {
                name: "ability",
                label: "ability",
                note: "Ability",
                type: "selection",
                choices: this._choices
            },
            dc: {
                name: "dc",
                label: "dc",
                note: "Difficulty Class",
                defaultValue: 8,
                type: "number",
            }
        };
    }
}

class AbilityTestCustomized {
    constructor() {
        this.data = { dc: 8, ability: "" };
        this.action = async (initiatorData) => {
            const actor = beaversSystemInterface.initiator(initiatorData).actor;
            const roll = await beaversSystemInterface.actorRollAbility(actor, this.data.ability);
            return {
                success: (roll.total >= (this.data.dc || 0)) ? 1 : 0,
                fail: (roll.total < (this.data.dc || 0)) ? 1 : 0
            };
        };
        this.render = () => {
            const ability = this.parent._choices[this.data.ability]?.text || "process";
            return `${ability}: dc ${this.data.dc}`;
        };
    }
}

beaversSystemInterface.registerTestClass(new AbilityTest());