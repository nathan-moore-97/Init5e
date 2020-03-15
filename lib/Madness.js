var exports = module.exports = {};
var dice = require('./Dice');
exports.longTerm = function() {
    var result = `For ${Math.floor(((dice.d(10) * 10) + dice.d(10)) / 24)} day(s), `;
    var roll = dice.d(100);
    if(roll.between(1, 10)) {
        return result + "The character feels compelled to repeat a specific activity over and over, such as washing hands, touching things, praying, or counting coins.";
    } else if(roll.between(11, 20)) {
        return result + 'The character experiences vivid hallucinations and has disadvantage on ability checks.';
    } else if(roll.between(21, 30)) {
        return result + 'The character suffers extreme paranoia. The character has disadvantage on Wisdom and Charisma checks.';
    } else if(roll.between(31, 40)) {
        return result + 'The character regards something (usually the source of madness) with intense revulsion, as if affected by the antipathy effect of the antipathy/sympathy spell.';
    } else if(roll.between(41, 45)) {
        return result + 'The character experiences a powerful delusion. Choose a potion. The character imagines that he or she is under its effects.';
    } else if(roll.between(46, 55)) {
        return result + "The character becomes attached to a “lucky charm,” such as a person or an object, and has disadvantage on attack rolls, ability checks, and saving throws while more than 30 feet from it.";
    } else if(roll.between(56, 65)) {
        if(dice.d(4) === 1) {
            return result + 'The character is blinded';
        } else {
            return result + 'The character is deafened';
        }
    } else if(roll.between(66, 75)) {
        return result + 'The character experiences uncontrollable tremors or tics, which impose disadvantage on attack rolls, ability checks, and saving throws that involve Strength or Dexterity.';
    } else if(roll.between(76, 85)) {
        return result + 'The character suffers from partial amnesia. The character knows who he or she is and retains racial traits and class features, but doesn’t recognize other people or remember anything that happened before the madness took effect.';
    } else if(roll.between(86, 90)) {
        return result + 'Whenever the character takes damage, he or she must succeed on a DC 15 Wisdom saving throw or be affected as though he or she failed a saving throw against the confusion spell. The confusion effect lasts for 1 minute.';
    } else if(roll.between(91, 95)) {
        return result + 'The character loses the ability to speak.';
    } else if (roll.between(96, 100)) {
        return result + 'The character falls unconscious. No amount of jostling or damage can wake the character.';
    }
}

exports.shortTerm = function() {
    var result = `For ${dice.d(10)} minute(s), `;
    var roll = dice.d(100);   

    if (roll.between(1, 20)) {
        return result + 'The character retreats into his or her mind and becomes paralyzed. The effect ends if the character takes any damage.';
    } else if (roll.between(21, 30)) {
        return result + 'The character becomes incapacitated and spends the duration screaming, laughing, or weeping.';
    } else if (roll.between(31, 40)) {
        return result + 'The character becomes frightened and must use his or her action and movement each round to flee from the source of the fear.';
    } else if (roll.between(41, 50)) {
        return result + 'The character begins babbling and is incapable of normal speech or spellcasting.';
    } else if (roll.between(51, 60)) {
        return result + 'The character must use his or her action each round to attack the nearest creature.';
    } else if (roll.between(61, 70)) {
        return result + 'The character experiences vivid hallucinations and has disadvantage on ability checks.';
    } else if (roll.between(71, 75)) {
        return result + 'The character does whatever anyone tells him or her to do that isn’t obviously self-destructive.';
    } else if (roll.between(76, 80)) {
        return result + 'The character experiences an overpowering urge to eat something strange such as dirt, slime, or offal.';
    } else if (roll.between(81, 90)) {
        return result + 'The character is stunned.';
    } else if (roll.between(91, 100)) {
        return result + 'The character falls unconscious.';
    }
}

exports.indefinite = function() {
    var roll = dice.d(100);
    if (roll.between(1, 15)) {
        return `"Being drunk keeps me sane`;
    } else if (roll.between(16, 25)) {
        return `"I keep whatever I find"`;
    } else if (roll.between(26, 30)) {
        return `"I try to become more like someone else I know—adopting his or her style of dress, mannerisms, and name."`;
    } else if (roll.between(31, 35)) {
        return `“I must bend the truth, exaggerate, or outright lie to be interesting to other people.”`;
    } else if (roll.between(36, 45)) {
        return `“Achieving my goal is the only thing of interest to me, and I’ll ignore everything else to pursue it.”`;
    } else if (roll.between(46, 50)) {
        return `“I find it hard to care about anything that goes on around me.”`;
    } else if (roll.between(51, 55)) {
        return `“I don’t like the way people judge me all the time.”`;
    } else if (roll.between(56, 70)) {
        return `“I am the smartest, wisest, strongest, fastest, and most beautiful person I know.”`;
    } else if (roll.between(71, 80)) {
        return `“I am convinced that powerful enemies are hunting me, and their agents are everywhere I go. I am sure they’re watching me all the time.”`;
    } else if (roll.between(81, 85)) {
        return `“There’s only one person I can trust. And only I can see this Special friend.”`;
    } else if (roll.between(86, 95)) {
        return `“I can’t take anything seriously. The more serious the situation, the funnier I find it.”`;
    } else if (roll.between(96, 100)) {
        return `“I’ve discovered that I really like killing people.”`;
    }
}

Number.prototype.between = function(min, max) {
    return (this >= min && this <= max);
}