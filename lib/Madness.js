var exports = module.exports = {};

exports.rollLongTermMadness = function() {
    var result = `For ${Math.floor(((d(10) * 10) + d(10)) / 24)} day(s), `;
    var roll = d(100);
    if(roll.between(1, 10)) {
        return result + "The character feels compelled to repeat a specific activity over and over, such as washing hands, touching things, praying, or counting coins.";
    }
    if(roll.between(11, 20)) {
        return result + 'The character experiences vivid hallucinations and has disadvantage on ability checks.';
    }
    if(roll.between(21, 30)) {
        return result + 'The character suffers extreme paranoia. The character has disadvantage on Wisdom and Charisma checks.';
    }
    if(roll.between(31, 40)) {
        return result + 'The character regards something (usually the source of madness) with intense revulsion, as if affected by the antipathy effect of the antipathy/sympathy spell.';
    }
    if(roll.between(41, 45)) {
        return result + 'The character experiences a powerful delusion. Choose a potion. The character imagines that he or she is under its effects.';
    }
    if(roll.between(46, 55)) {
        return result + "The character becomes attached to a “lucky charm,” such as a person or an object, and has disadvantage on attack rolls, ability checks, and saving throws while more than 30 feet from it.";
    }
    if(roll.between(56, 65)) {
        if(d(4) === 1) {
            return result + 'The character is blinded';
        } else {
            return result + 'The character is deafened';
        }
    }
    if(roll.between(66, 75)) {
        return result + 'The character experiences uncontrollable tremors or tics, which impose disadvantage on attack rolls, ability checks, and saving throws that involve Strength or Dexterity.';
    }
    if(roll.between(76, 85)) {
        return result + 'The character suffers from partial amnesia. The character knows who he or she is and retains racial traits and class features, but doesn’t recognize other people or remember anything that happened before the madness took effect.';
    }
    if(roll.between(86, 90)) {
        return result + 'Whenever the character takes damage, he or she must succeed on a DC 15 Wisdom saving throw or be affected as though he or she failed a saving throw against the confusion spell. The confusion effect lasts for 1 minute.';
    }
    if(roll.between(91, 95)) {
        return result + 'The character loses the ability to speak.';
    }
    if (roll.between(96, 100)) {
        return result + 'The character falls unconscious. No amount of jostling or damage can wake the character.';
    }
}

exports.rollShortTermMadness = function() {
    var result = `For ${d(10)} minute(s), `;
    var roll = d(100);   

    if (roll.between(1, 20)) {
        return result + 'The character retreats into his or her mind and becomes paralyzed. The effect ends if the character takes any damage.';
    }
    if (roll.between(21, 30)) {
        return result + 'The character becomes incapacitated and spends the duration screaming, laughing, or weeping.';
    }
    if (roll.between(31, 40)) {
        return result + 'The character becomes frightened and must use his or her action and movement each round to flee from the source of the fear.';
    }
    if (roll.between(41, 50)) {
        return result + 'The character begins babbling and is incapable of normal speech or spellcasting.';
    }
    if (roll.between(51, 60)) {
        return result + 'The character must use his or her action each round to attack the nearest creature.';
    }
    if (roll.between(61, 70)) {
        return result + 'The character experiences vivid hallucinations and has disadvantage on ability checks.';
    }
    if (roll.between(71, 75)) {
        return result + 'The character does whatever anyone tells him or her to do that isn’t obviously self-destructive.';
    }
    if (roll.between(76, 80)) {
        return result + 'The character experiences an overpowering urge to eat something strange such as dirt, slime, or offal.';
    }
    if (roll.between(81, 90)) {
        return result + 'The character is stunned.';
    }
    if (roll.between(91, 100)) {
        return result + 'The character falls unconscious.';
    }
}

// n-sided die
function d(n) {
    return Math.floor(Math.random() * (n - 1 + 1)) + 1;
}

Number.prototype.between = function(min, max) {
    return (this >= min && this <= max);
}