drop database if exists Chaos5e;
create database Chaos5e character set UTF8 collate utf8_general_ci;
use Chaos5e;


create table lu_character (
    character_id integer(10) not null auto_increment,
    -- DM view information
    player_name varchar(255) not null,
    char_name varchar(255) not null,
    class varchar(50), -- new table!
    race varchar(50) not null, -- new table!
    level integer(10),
    ac integer(10) not null,
    passive_perception integer(10) not null,
    speed integer(10), -- feet/6sec
    spell_save integer(10),
    notes varchar(1000),
    -- initiative processing information
    dex integer(10) not null, 
    pc boolean,
    alignment varchar(25),
    init_adv boolean,
    primary key (character_id)
);

create table lu_encounter (
    encounter_id integer(10) not null auto_increment,
    encounter_name varchar(255),
    encounter_notes varchar(1000),
    primary key(encounter_id)
);


create table lu_fight (
    encounter_id integer(10),
    combatant_id integer(10),
    foreign key(encounter_id) references lu_encounter(encounter_id),
    foreign key(combatant_id) references lu_character(character_id)
);

-- Seed some characters into the database

insert into lu_character (player_name, char_name, class, race, level, ac, passive_perception, speed, spell_save, notes, dex_mod, pc, init_adv)
values ('Larry', 'Mordechai', 'Rogue', 'Lightfoot Halfling', 2, 14, 10, 25, NULL, NULL, 3, TRUE, FALSE);

insert into lu_character (player_name, char_name, class, race, level, ac, passive_perception, speed, spell_save, notes, dex_mod, pc, init_adv)
values ('Bryce', 'The Unamed', 'Wizard', 'High Elf', 2, 12, 13, 30, 13, NULL, 2, TRUE, FALSE);

insert into lu_character (player_name, char_name, class, race, level, ac, passive_perception, speed, spell_save, notes, dex_mod, pc, init_adv)
values ('Guy', 'Goosefat Bill', 'Fighter', 'Human', 2, 14, 13, 30, NULL, NULL, 3, TRUE, FALSE);

insert into lu_character (player_name, char_name, class, race, level, ac, passive_perception, speed, spell_save, notes, dex_mod, pc, init_adv)
values ('Claude', 'Bertram of Deredin', 'Fighter', 'Human', 2, 17, 13, 30, NULL, NULL, -1, TRUE, FALSE);

insert into lu_character (player_name, char_name, class, race, level, ac, passive_perception, speed, spell_save, notes, dex_mod, pc, init_adv)
values ('David', 'Mûrgrout Mountainforged', 'Cleric', 'Hill Dwarf', 2, 18, 13, 25, 13, NULL, -1, TRUE, FALSE);

insert into lu_character (player_name, char_name, class, race, level, ac, passive_perception, speed, spell_save, notes, dex_mod, pc, init_adv)
values ('NPC', 'Bugbear', 'Chaotic Evil', 'Medium Goblinoid', NULL, 16, 10, 30, NULL, 'Bugbears are hairy goblinoids born for battle and mayhem. They survive by raiding and hunting, but are fond of setting ambushes and fleeing when outmatched.', 2, FALSE, FALSE);

-- insert goblin boys

insert into lu_encounter(encounter_name, encounter_notes) 
values ('Klarg\'s Lair', 'This is the lair of Klarg the Bugbear, leader of the cragmaw globlins. Klarg becomes enraged when his dogs are killed but cares little for the slaughter of the goblins.');

insert into lu_fight(encounter_id, combatant_id) values (1,1);
insert into lu_fight(encounter_id, combatant_id) values (1,2);
insert into lu_fight(encounter_id, combatant_id) values (1,3);
insert into lu_fight(encounter_id, combatant_id) values (1,4);
insert into lu_fight(encounter_id, combatant_id) values (1,5);
insert into lu_fight(encounter_id, combatant_id) values (1,6);
insert into lu_fight(encounter_id, combatant_id) values (1,6);
insert into lu_fight(encounter_id, combatant_id) values (1,6);

