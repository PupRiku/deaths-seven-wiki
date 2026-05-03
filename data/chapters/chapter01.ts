import type { Chapter } from '@/types';

const chapter: Chapter = {
  number: 1,
  act: 1 as const,
  title: 'The First Step',
  levelStart: 3,
  levelEnd: 4,
  summary:
    'The party awakens in unfamiliar bodies, meets their guide Fizzle, travels to Nova Clarus, receives their first mission, is captured by General Draven, and escapes the Mountain Dungeon with the Relic Stone — unknowingly aided by the Aspirant.',
  sections: [
    {
      title: 'Introduction',
      type: 'prose',
      content:
        'You are dead. Or rather — you were. The cold, silent embrace of death was the last thing you knew. Now, inexplicably, impossibly, you feel grass beneath your fingers and sunlight on your face. You open your eyes to a sky that is too bright, in a body that is not quite yours.',
    },
    {
      title: 'Opening — The Field',
      type: 'scene',
      content:
        "The party wakes one by one in an open field. They have time to react, discover their new bodies, and roleplay with each other before anything else happens. Do not rush this scene — it is the campaign's first moment and it belongs to the players.",
      boxedText:
        'The last thing you remember is the cold, silent embrace of death. Now you feel grass beneath you. Real grass. You smell air — warm, alive, faintly sweet. You open your eyes to a sky that is unreasonably, almost offensively blue. Every part of you aches. None of these parts are the parts you remember having.',
      dmNote:
        'Let the table react. Do not rush this. Give each player a moment to discover their new body — the wrong hands, the wrong height, the wrong everything. Let them introduce themselves, compare notes, try to piece together what is happening. They share one thing in common: the certain knowledge that they were dead, and the equally certain knowledge that they are not anymore. There is no right amount of time for this scene. When the table feels ready to move, that is when you hear it.',
    },
    {
      title: 'Encounter 1 — The Goblin Pack',
      type: 'encounter',
      content:
        "A small pack of goblins has been harassing Fizzle. This is the party's first combat in their new bodies — keep it loose and fun.",
      boxedText:
        'A voice reaches you first — high-pitched, frantic, getting louder very fast. Then you see her: a tiny winged figure streaking across the field toward you at full speed, looking over her shoulder more than she is looking where she is going. Behind her, four goblins are giving enthusiastic chase. She spots you, makes a very sharp turn that nearly sends her tumbling, and dives directly behind the nearest party member. A small hand grabs a fistful of whatever clothing is available. "You!" she says, slightly out of breath. "Excellent! You look like you can handle this! Fighting! That\'s a thing, right? You fight them! Now please!" She peeks around your shoulder at the goblins, who have spotted you and slowed to a predatory lope. "I\'m Fizzle, by the way. We can do introductions after."',
      creatures: ['4 Scavenger Goblins'],
      tactics:
        'The goblins are opportunistic and cowardly. They scatter if three or more are dropped. Their goal is Fizzle, not the party — they may ignore players in favor of chasing the fairy, which forces the party to intervene.',
      dmNote:
        "Initiative is called the moment the table is ready — Fizzle's 'we can do introductions after' is the natural cue. The goblins have spotted the party and are approaching. This fight exists to let players discover their randomized builds in a low-stakes environment. Let it be chaotic and fun.",
    },
    {
      title: 'Fizzle Explains (Sort Of)',
      type: 'scene',
      content:
        'With the goblins routed, Fizzle finally introduces herself and gives the party the broad shape of the mission. She walks them onward while she talks — questions get answered on the road.',
      boxedText:
        'The last goblin turns and flees. Fizzle watches it go, smooths her wings with considerable dignity, and turns to face you as though none of that just happened. "Right. So." She clears her throat. "I\'m Fizzle. I work for Nyx — you know, the Nyx, god of the dead, very important, lovely employer. And you—" she gestures at all of you with the air of someone delivering both good and bad news simultaneously, "—are hers too, now. Sort of. It\'s complicated." She lands on the nearest available surface and sits down. "You were dead. Now you\'re not. You have new bodies, which I can see is going very great for everyone. And there is a job. A very important job. The fate-of-the-world kind." She pauses. "I would have led with the job but you were unconscious and then there were goblins." She looks at each of you in turn. "Questions? Actually — walk with me. I\'ll explain on the way. We have somewhere to be."',
      dmNote:
        'This is the natural moment for players to ask questions — let them. Fizzle has answers but delivers them in Fizzle\'s way: enthusiastic, slightly chaotic, genuinely caring. She knows the broad shape of the mission but not every detail. "Nyx will explain more when the time is right" is a perfectly valid answer and also true. "Walk with me" is the transition that moves the party toward Nova Clarus and ends the field scene.',
    },
    {
      title: 'The Village of Janus',
      type: 'scene',
      content:
        'Fizzle leads the party to the nearby village of Janus — a classic, unremarkable farming village with an inn, a pub, and a few small shops. Fizzle wants to get the characters here as fast as possible (they have been lying in a field in new bodies and, frankly, they stink). The party can rest, clean up, and resupply before pushing on to Nova Clarus.',
      keyInfo: [
        "MAMA BESS: The innkeeper. A stout, warm woman of advanced years with flour-dusted hands and an opinion about everything. She fusses over the party immediately — insisting they eat, commenting on their unusual appearances with blunt but good-natured curiosity, and refusing to let anyone leave without something warm in their stomach. She calls everyone 'love' within thirty seconds of meeting them.",
        "BUCKET: Mama Bess's ancient blink dog. Moves slowly. Sleeps constantly. One ear doesn't work anymore. She blinks only occasionally and usually ends up a few inches from where she intended. Mama Bess is convinced Bucket is 'still sharp as a tack.' Bucket is not. But she wags her tail at everyone.",
      ],
      dmNote:
        'This scene exists entirely to be destroyed. Give Mama Bess a line or two that sticks — a joke, a piece of unsolicited advice, a moment of genuine warmth. Let Bucket sniff a character and fall asleep on their foot. Give the players five minutes to feel safe and at home. The contrast with the burned village is everything. Do not rush it.',
    },
    {
      title: "Fizzle's Briefing",
      type: 'scene',
      content:
        'Once the party is settled at the inn — fed, cleaned up, and seated somewhere warm — Fizzle produces a small magical token with great ceremony and delivers her briefing. This is the full scope of their mission, delivered in a safe and cozy space. Before everything changes.',
      keyInfo: [
        'They are alive again — resurrected by Nyx, the god of death.',
        'They have a new, one-time gift of a second life.',
        "There is one catch: they must reap the Seven Souls of Sin, released by a 'very, very bad man.'",
        'If they succeed, they get to keep their new life and choose their permanent form.',
        "She knows where to go next: the 'big city' — Nova Clarus.",
      ],
      dmNote:
        "Fizzle does not know everything. She can answer basic questions but deflects anything too specific with 'Nyx didn't tell me that part!' She is genuinely trying her best. Play her as overwhelmed but enthusiastic — she cares about the party even if she met them thirty seconds ago. Mama Bess will almost certainly interrupt at least once with a refill or an unsolicited comment. Let her.",
    },
    {
      title: 'Nova Clarus — The Nova Sentinels',
      type: 'scene',
      content:
        "Fizzle guides the party to Nova Clarus and directly to the headquarters of the Nova Sentinels — the city's elite special forces. Their motto is carved above the door: 'We don't start fights, but we'll finish them.'",
      boxedText:
        "The half-orc commander sizes you up, her gaze lingering on your mismatched forms. \"Fizzle says you're good in a scrap. Fine. I don't know what god-snot you crawled out of, but the Sentinels need bodies. We have a saying here: 'Don't do anything stupid.' Your first job is simple. That village you just came from — Janus? We've lost contact. Probably just a broken signal, but I need a team to go check it out. Go there, see what's wrong, and report back. No heroics. Understand?\"",
      keyInfo: [
        "Nazura provides the party with a squad house in one of the city's three districts (Green, Blue, or Yellow — player choice).",
        'Each character receives starting weapons and armor appropriate to their new class, rations, and 2 potions of healing.',
        'Each character receives a stipend of 25gp for additional provisions from the Yellow District market.',
      ],
      dmNote:
        'Nazura knows who the party really is — she is one of three people in Nova Clarus who do. She is testing them here, not genuinely treating them as raw recruits. She keeps this knowledge secret for now. Play her as gruff but fair. She wants to believe in them.',
    },
    {
      title: 'Mission 1 — The Ashes of Janus',
      type: 'scene',
      content:
        'As the party travels back toward Janus, Fizzle chatters excitedly, asking about their old lives — a natural opening for players to share backstory. The mood breaks the moment they crest the final hill.',
      boxedText:
        "The cheerful chatter dies in Fizzle's throat. The smell hits you first — acrid, choking smoke. A light wind carries a piece of burnt parchment, a flier for the very inn you just stayed at. As you crest the final hill, you see what remains of Janus. It is a smoldering, black scar on the landscape.",
      dmNote:
        "No bodies. Only drag marks and footprints. The village was not massacred — it was emptied. Soldiers from Wrath's army (use Guard or Thug stat blocks) are still on site, turning over debris looking for survivors to kill or capture. The party should feel the weight of this before combat begins — the inn they visited, the faces they may have spoken to, all of it gone.",
      bucket: {
        discovery:
          'As the party searches the ruins of the inn, a DC 10 Perception check — or simply following a faint sound — leads them to the kitchen, the one room with enough standing walls to offer shelter. Bucket is curled there, nursing a litter of four newborn blink pups. Their eyes are not yet open. They blink sporadically and uncontrollably — tiny flickering teleportations, appearing and disappearing a few inches at a time in the straw. Bucket looks up at the party and wags her tail once, slowly. Then she looks toward the door, waiting.',
        encounter:
          'This is the moment the thugs arrive. The sound of boots on rubble. The party must fight — but Fizzle, seeing the pups, immediately volunteers to handle them. She spends the entire combat frantically chasing newborn blinking puppies around the ruined kitchen, appearing and disappearing after them, muttering increasingly stressed fairy profanity. She keeps them safe. She is very stressed about it.',
        aftermath:
          "When the fight is over and the dust settles, Bucket does not stay with the pups. She moves slowly through the ruins of the inn, sniffing at the places Mama Bess used to stand — the bar, the hearth, the kitchen door. Then she finds the fireplace. She circles once. She lies down. She puts her head on her paws. Fizzle goes very quiet. If asked, she says softly: 'She's not in pain. She's just... done. She was waiting to make sure everyone was okay.' Bucket's tail wags once more. Then she closes her eyes.",
        dmNote:
          "Do not narrate Bucket's death explicitly. Let it happen in the background, gently, while the party is tending to wounds and collecting themselves. Fizzle sensing it is the signal — her going quiet is the tell. The pups are the party's now, whether they planned for it or not. Four newborn blink dogs with no mother, no home, and no idea how their own abilities work yet. What the party does next is up to them entirely.",
      },
    },
    {
      title: "Encounter 2 — Wrath's Soldiers",
      type: 'encounter',
      content:
        "A squad of Wrath's soldiers is combing the ruins for survivors. After the party defeats them, their leader arrives.",
      creatures: ['4 Wrathbound Soldiers'],
      tactics:
        'The soldiers fight aggressively and without mercy. They do not retreat. If the party seems to be struggling, reduce the number. This fight should be winnable but feel serious.',
      dmNote:
        'Let the party have a genuine victory here. They need to feel capable before Draven walks out. The contrast is everything.',
    },
    {
      title: 'Encounter 3 — General Draven (Unwinnable)',
      type: 'encounter',
      content:
        'After the soldiers fall, their general emerges from the ruins of the inn. This fight cannot be won. The party will be captured.',
      boxedText:
        'A massive figure, clad in scorched black plate armor, steps from the ruins of the inn. He applauds slowly, his metal gauntlets making a sharp, metallic clang. "Impressive. Truly. I don\'t know what hole you crawled out of, but you fight like people who have died before. But there is a difference between courage and survival. You have the first. You lack the second." He raises one hand. The treeline fills with soldiers. "Rest. You\'ve earned it."',
      creatures: [
        'General Draven (custom stat block — late game boss, use as needed for narrative)',
      ],
      tactics:
        'Draven is immune to non-magical bludgeoning, piercing, and slashing damage. Immune to fire and poison. Resistant to all other magic. Any physical attack against him — hit or miss — provokes an immediate counterattack dealing massive non-lethal damage, designed to drop a level 3 character in one hit. The combat ends when all party members are unconscious or surrender.',
      dmNote:
        "CRITICAL: Make it clear the party is knocked unconscious, not dying. No death saves. They wake up in a cell. Draven's tone is key — he is not contemptuous. He is impressed. He respects the fight. He ends it anyway. The 'died before' line is dramatic irony he does not understand yet. Let it land.",
    },
    {
      title: 'The Mountain Dungeon — Layer 1: The Cell',
      type: 'scene',
      content:
        'The party wakes in a large communal cell, stripped of all gear. One barred door. A torch in the corridor outside, just out of reach. A guard patrols past every 10 minutes.',
      keyInfo: [
        'OBSERVABLE: Rough-hewn walls with visible mortar seams. A rusted drain grate in the floor (too small to crawl through). A crude bench bolted to the wall. Prisoner tally marks scratched above the bench — one cluster arranged oddly, almost like a crude map. A small ventilation shaft above the door (too small for a body). The cell across the hall is empty but has a bucket, straw, and a hanging key ring on the far wall.',
        'RED HERRING 1 — THE DRAIN: DC 12 Strength pops off the grate. Pipe inside is only 6 inches wide — useless for escape. But if someone reaches inside: a waterlogged scrap of parchment with a partial dungeon map. Useful for Layer 2.',
        'RED HERRING 2 — THE VENTILATION SHAFT: DC 13 Perception confirms it is only 8 inches wide. However it connects to the cell across the hall. Small items can pass through it. This becomes part of the solution.',
        'STEP 1: DC 14 Investigation (or hands-on examination) of the bench reveals one bolt is a pin holding a hinged panel. Inside: a short iron rod (18 inches) and a loop of wire.',
        'STEP 2: The odd tally marks (DC 12 Investigation or good observation) form an arrow pointing to the floor beside the drain. Using the rod as a lever pries up the stone — no roll if they think of it. Inside: a lodestone magnet.',
        'STEP 3: Magnet tied to wire, fed through the ventilation shaft, guided from the cell door end using the iron rod — drags the key ring off its hook across the hall and within reach through the vent. Requires two players coordinating. DC 14 Dexterity check. Failure = retry. Natural 1 = wire snaps, must improvise a replacement.',
      ],
      dmNote:
        "Do not rush this puzzle. Let the party explore, theorize, and experiment. The drain red herring pays off with the map — no investigation is wasted. The ventilation shaft that 'leads nowhere' is secretly the core mechanism. Players who find the map will feel clever in Layer 2. Players who engineer the magnet-wire solution will feel like a team.",
    },
    {
      title: 'The Mountain Dungeon — Layer 2: The Escape',
      type: 'scene',
      content:
        'Once free of the cell, the party must navigate the dungeon, locate their gear, find the Relic Stone, and encounter the Aspirant — all without alerting the garrison.',
      keyInfo: [
        'GUARD PATROL: 10-minute loop. The party can track this rhythm from the cell before escaping.',
        "KEY 2 — GEAR ROOM: All party equipment, neatly stacked. Bonus: a locked strongbox (DC 15 Thieves' Tools) contains 50gp, a potion of healing, and an intercepted Nova Sentinels letter — seeds that Wrath has been watching Nova Clarus longer than anyone knows.",
        'KEY 3 — BARRACKS (TRAP): DC 14 Perception hears snoring before the door swings open. Inside: 8 sleeping guards. DC 15 Stealth to loot without waking anyone. Tempting, dangerous, optional.',
        'KEY 4 — PROVISIONS ROOM: Rations, rope, torches, 2 potions of healing. No roll needed.',
        'THE CAVED-IN SECTION: Looks like a dead end. The partial map hints it exists. Without the map: DC 15 Investigation notices an air current through the rubble. DC 15 group Strength check or 10 minutes of quiet work to clear it. Inside: a locked box. Key 5 opens it. The Relic Stone.',
      ],
      dmNote:
        "The Aspirant's cell sits between the gear room and the caved-in section — the party passes it going both directions. He calls out the first time they pass. His timing is deliberate.",
    },
    {
      title: 'The Aspirant — The Beggar',
      type: 'scene',
      content:
        'As the party moves through the dungeon, a voice calls out from a dark cell.',
      boxedText:
        '"No, wait! Please, don\'t leave me! They\'ll kill me... I know things about this place! I know how to get out — and how to get back at that monster! Please!"',
      keyInfo: [
        "He claims to be a thief who was forced to serve as an informant for Wrath's army.",
        "He 'overheard' guards talking about a caved-in section holding an old artifact that can make weapons magical — the only way to hurt Wrath.",
        'He planted the artifact and engineered the cave-in. He needs someone else to retrieve it because he cannot kill what he summoned.',
        "He refuses to leave his cell when offered: 'If I disappear, the guards will know something's wrong immediately. I'll stay here, keep my head down — it's the only way to make sure you get away clean.'",
        'He points the party toward a secret exit — a small unguarded fissure in the back of the caves.',
      ],
      dmNote:
        "Play him as pathetic, grateful, and just credible enough. He is not over-the-top villainous — he is calm, clever, and completely in control of this interaction while appearing to be at the party's mercy. His refusal to leave should feel selfless. It is the opposite. He has no intention of leaving his observation post. The party will likely feel warmly toward him. Good.",
    },
    {
      title: 'The Escape & Conclusion',
      type: 'scene',
      content:
        'The party escapes through the fissure the Aspirant indicated, emerging into the wilderness and making their way back to Nova Clarus. They carry the Relic Stone and a (false) sense of having made a friend on the inside.',
      boxedText: '"Now go! And give that monster general hell for me."',
      keyInfo: [
        'The party returns to Nova Clarus victorious, battered, and with a wild story for Commander Nazura.',
        "When they mention the Relic Stone, Nazura's professional demeanor breaks entirely.",
        'She locks the door, drops the pretense, and reveals she knows who they really are.',
        'LEVEL UP: Characters advance to Level 4.',
      ],
      dmNote:
        "End the chapter on the reveal — Nazura's reaction to the Relic Stone is the cliffhanger. 'Say that again. The stone.' Let that moment breathe before you call it a session.",
    },
  ],
};

export default chapter;
