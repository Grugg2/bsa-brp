class SkillTest {
    constructor() {
        this.type = "SkillTest";
        this._choices = {};
        this.informationField = {
            name: "type",
            type: "info",
            label: game['i18n'].localize("beaversSystemInterface.tests.skillTest.info.label"),
            note: game['i18n'].localize("beaversSystemInterface.tests.skillTest.info.note")
        };
        this._choices = beaversSystemInterface.configSkills.reduce((object, skill) => {
            object[skill.id] = { text: skill.label };
            return object;
        }, {});
    }

    create(data) {
        const result = new SkillTestCustomized();
        result.data = data;
        result.parent = this;
        return result;
    }

    get customizationFields() {
        return {
            skill: {
                name: "skill",
                label: "skill",
                note: "Skill",
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

class SkillTestCustomized {
    constructor() {
        this.data = { dc: 8, skill: "" };
        this.action = async (initiatorData) => {
            const actor = beaversSystemInterface.initiator(initiatorData).actor;
            const roll = await beaversSystemInterface.actorRollSkill(actor, this.data.skill);
            return {
                success: roll.total >= this.data.dc ? 1 : 0,
                fail: roll.total < this.data.dc ? 1 : 0
            };
        };
        this.render = () => {
            const skill = this.parent._choices[this.data.skill]?.text || "process";
            return `${skill}: dc ${this.data.dc}`;
        };
    }
}

beaversSystemInterface.registerTestClass(new SkillTest());