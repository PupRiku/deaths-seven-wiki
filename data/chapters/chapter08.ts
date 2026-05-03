import type { Chapter } from "@/types"

const chapter: Chapter = {
      number: 8,
      act: 1 as const,
      title: "The Siege of Nova Clarus",
      levelStart: 9,
      levelEnd: 10,
      summary: "The party returns to Nova Clarus aboard the Azure Piercer to find their home city under full assault by General Draven's army. From the airship they see three simultaneous crises — they can only address two. They fight through burning streets, protect Thraggin long enough to blow a critical chokepoint, and face Warlord Goresh at the University gates in the first real demonstration of the Soul Siphons' power. The siege breaks. Then everyone sits around a map and decides what comes next.",
      sections: [
        {
          title: "The Approach",
          type: "scene",
          content: "The Azure Piercer descends toward Nova Clarus through a sky choked with smoke. The pilot is already adjusting course around debris. The party crowds the forward viewport.",
          boxedText: "You have been gone for weeks. Nova Clarus looks like it has been at war for all of them. The White District walls are scarred black. The Yellow District market — your market, the one with the apple stall where you first met Leocraes — is a ruin. Draven's army moves through the streets in organized columns, red-eyed and steaming, and the city is fighting back but it is losing. Three things register at once.",
          keyInfo: [
            "CRISIS 1 — THE MARKET: Commander Nazura is holding a defensive line in the Market District with eight battered Sentinels. A wave of Wrath-Infused Berserkers is pushing them toward a dead end. She has perhaps four minutes before the line breaks.",
            "CRISIS 2 — THE UNIVERSITY GATES: Prince Leocraes is dueling a massive armored commander at the University gates. He is losing. His guard is dead around him. The gates behind him are the only thing between Draven's army and the crystal mines.",
            "CRISIS 3 — THE CRYSTAL MINES: A crowd of sixty civilians — workers, students, families — is trapped at the mines entrance, cut off by a collapsed burning building. No soldiers are near them. They have no weapons. The fire is spreading.",
            "The pilot confirms he can hold position for a fast-rope drop to one location. The party must split or prioritize — they cannot reach all three in time.",
          ],
          dmNote: "Give the party thirty seconds of real table time to decide. Do not rush them. The three crises are visible simultaneously and each is genuinely urgent. The mines crisis has no combat — it requires Athletics and Investigation checks to clear rubble and find a safe route — but sixty people die if nobody goes. Nazura and Leocraes can survive longer than the civilians can. Smart parties will send their most capable fighters to one of the first two and anyone else to the mines. All three outcomes affect the aftermath.",
        },
        {
          title: "Crisis Resolution — The Mines",
          type: "encounter",
          content: "If any party member goes to the crystal mines entrance, they find sixty terrified civilians, a collapsed burning building blocking the only exit, and approximately six minutes before the fire reaches the mine's powder stores.",
          keyInfo: [
            "CLEAR THE RUBBLE: DC 15 group Strength check — every character present contributes. Each additional character beyond the first reduces the DC by 2. Success clears a path in 2 minutes. Failure means another attempt but costs 2 more minutes.",
            "FIND THE SAFE ROUTE: DC 13 Investigation or Survival identifies a secondary tunnel exit through the mine that bypasses the fire entirely. Success saves all sixty. Failure means the rubble route — all sixty survive but three are badly injured.",
            "FIRE SPREADING: If the party takes longer than 6 minutes, the powder store ignites — 6d6 fire damage to all within 30 feet and the secondary tunnel collapses. The civilians still escape via the rubble route but the party loses the clean exit.",
            "AFTERMATH: If all sixty civilians are saved, word spreads through the city within hours. The party's name means something in Nova Clarus now in a way it didn't before.",
          ],
          dmNote: "The mines crisis is the one that tests whether the party thinks of ordinary people as part of the mission or background dressing. There is no combat reward here — no boss loot, no tactical advantage. Just sixty people who would have died. If the party splits to cover all three crises, whoever goes to the mines should feel like they made the right call even without a fight to show for it.",
        },
        {
          title: "Encounter 1 — The Market Drop",
          type: "encounter",
          content: "The Azure Piercer hovers over the Market District and the party drops into the fray. Nazura's line is seconds from breaking.",
          boxedText: "Nazura swings her greataxe and a Berserker goes down. She looks up at the airship, then at you, and her expression does something complicated — relief and fury in equal measure. 'You came back,' she says. 'Good. Now help me.'",
          creatures: [
            "8 Wrath-Infused Berserkers (Berserker stat block, MM p.344 — permanently Raging, Relentless Endurance)",
            "Commander Nazura — ally (Gladiator stat block, MM p.346)",
            "4 Sentinel Guards — ally (Guard stat block, MM p.347)",
          ],
          tactics: "The Berserkers are spread across the market in two waves of four — the first wave is already engaged with Nazura's line, the second arrives on round 2 from the eastern alley. Soul Siphon opportunity: any Berserker hit with a Soul Siphon immediately loses Rage and Relentless Endurance and is Stunned until end of next turn. The first time this happens Nazura stops mid-swing and stares. Let it land.",
          dmNote: "This is the Soul Siphon's first real field test. The moment a Berserker's red eyes clear and the steam stops rising and they just crumple — that is the payoff for everything the party went through to get these weapons. Give it a full descriptive beat. Nazura's reaction is the table's reaction mirrored back at them.",
        },
        {
          title: "Encounter 2 — Leocraes at the Gates",
          type: "encounter",
          content: "The University gates are moments from falling. Leocraes is on one knee, sword arm bleeding, staring up at the commander above him.",
          boxedText: "He sees you coming. Something in his face shifts — not quite relief, because relief implies he was afraid, and Leocraes is not the kind of man who lets himself be afraid. Something quieter than that. He gets back to his feet. 'I was managing,' he says. You look at his sword arm. 'I was,' he repeats.",
          creatures: [
            "Warlord Goresh (Warlord stat block or Gladiator at max HP — wielding a maul that deals fire damage)",
            "4 Blood-Guard Elite (Berserker stat block with 90 HP)",
            "Legendary Action: Goresh makes one melee attack or moves up to speed without provoking opportunity attacks",
          ],
          tactics: "Goresh prioritizes Leocraes — he was winning that duel and does not like the interruption. The Blood-Guard form a perimeter, trying to isolate party members from each other. Soul Siphon turning point: the first time a Blood-Guard is Siphoned, Goresh freezes for a full second. He has never seen this before. His next action is spent staring at where the red energy went. Use this — it is the moment the chapter pivots. At 25% HP Goresh sounds the retreat horn. The siege breaks.",
          dmNote: "The duel rescue is the emotional anchor of this encounter — Leocraes on one knee, getting back up, saying he was managing. He was not managing. He knows you know that. He will not say it again. The Goresh freeze when the Soul Siphon fires is the chapter's defining image — a general who has never been afraid of anything standing still for one second because something happened that he does not have a category for. Play it straight. No jokes. Just that second of stillness.",
        },
        {
          title: "The Soul Siphon Turning Point",
          type: "scene",
          content: "The first time a Soul Siphon activates in combat — whether in the Market or at the gates — the following happens.",
          boxedText: "As the module activates, a sound tears through the air — not a scream of pain but something older, something that predates language. The red mist is ripped from the soldier's body in a single violent arc and pulled into the crystal at your weapon's core. The soldier's eyes clear. They are confused. They are frightened. They are just a person again, for approximately one second, before they crumple to the ground. The red glow in the crystal pulses once and goes still. Around you, other Wrath-Infused soldiers stop. They felt it. They don't know what it was. But they felt something leave.",
          dmNote: "This boxed text fires once — the first Soul Siphon activation of the chapter, whichever it is. After this, subsequent activations get a shorter description. The first time is the revelation. The soldiers feeling it is the detail that will ripple forward — Goresh's freeze at the gates, the retreat horn, and eventually the terror that precedes every future battle with Draven's forces.",
        },
        {
          title: "Encounter 3 — Protecting Thraggin",
          type: "encounter",
          content: "With the Market secured, Nazura points toward the University approach — a narrow street blocked by rubble and two Wrath-Infused Ogres hurling debris. Thraggin is behind a barricade, covered in soot, wiring a shaped charge.",
          boxedText: "'About time!' the dwarf bellows, ducking a flying cobblestone with the practiced ease of someone who has been doing this for hours. He doesn't look up. 'Three rounds. I need three rounds without anything landing on me or this detonator, and I can blow this blockade wide open. Think you can manage that?' He finally looks up. He sees the airship hovering above the street. He looks back down. 'Nice ride,' he says, and goes back to wiring.",
          creatures: [
            "2 Wrath-Infused Ogres (Ogre stat block, MM p.237 — throwing debris as ranged attacks, 2d10+4 bludgeoning, range 30/60)",
            "4 Wrath-Infused Veterans (Veteran stat block, MM p.350)",
          ],
          tactics: "The Ogres throw debris — each throw is a ranged attack against a random target within range, including Thraggin if the party fails to draw their attention. A creature that uses its action to taunt or engage an Ogre draws its next attack onto themselves. The Veterans push through the flanks trying to reach Thraggin directly. SUCCESS after 3 rounds: Thraggin detonates the charge — the blockade collapses, burying the Ogres (DC 14 Dexterity save or restrained), clearing the path to the University. FAILURE if Thraggin is hit before round 3: the detonator is damaged — the party must clear the blockade manually (DC 17 group Strength, costs 2 rounds of combat) before proceeding.",
          dmNote: "The three-round protection mechanic works best if the DM tracks it openly — announce the round count each turn. Round 1: Thraggin is focused, muttering to himself. Round 2: he is almost there, hands moving faster. Round 3: he looks up, grins, and presses the detonator. The explosion should feel earned. If the charges fail because Thraggin gets hit, the party's faces will do the work — they know what it means and they have to fix it.",
        },
        {
          title: "The Siege Breaks",
          type: "scene",
          content: "Warlord Goresh sounds the retreat horn. The red eyes around the city flicker. The steam stops rising. The Wrath-Infused soldiers — some of them, the ones who were Siphoned — look around in confusion, seeing the burning city they are standing in as if for the first time. The army withdraws in organized columns. Draven is not broken. He is regrouping.",
          boxedText: "'They have the God-Killer! Fall back! Regroup at the main camp! FALL BACK!' The horn sounds three times. And then, for the first time in days, Nova Clarus is quiet enough to hear itself burn.",
          keyInfo: [
            "The siege is broken but the war is not over. Draven's army retreats to its field camp — still organized, still vast, now afraid of one specific thing.",
            "The city is badly damaged. The Yellow District market is gone. The outer wall has three breaches. The University is intact.",
            "CASUALTIES: If the party saved the mines civilians, all sixty survived. If Leocraes was rescued early, his sword arm will heal. If Nazura's line broke before the party arrived, she lost two Sentinels.",
            "LEVEL UP: Characters advance to Level 10.",
          ],
          dmNote: "The quiet after the horn is the scene. Let it run for a full beat — the fires crackling, the distant sound of the army withdrawing, the city exhaling. Then someone will say something. Let them. The chapter is not over yet but the siege is, and that deserves a moment.",
        },
        {
          title: "The War Council",
          type: "scene",
          content: "That evening, Nazura's war room. A map of the kingdom covers the table. Nazura, Leocraes, Thraggin, Fizzle, and the party gather around it. The Azure Piercer is moored on the University roof. The Soul Siphons are on the table.",
          boxedText: "Nazura looks at the Soul Siphons for a long moment. Then she looks at the map. Then she looks at you. 'Right,' she says. 'Tell me everything. And then we figure out what we do next.'",
          keyInfo: [
            "The party debriefs — the pass, Darkon, the Asylum, Jägerweiler, Voss, Valerius. Let this run. The NPCs react to each piece.",
            "Leocraes on the Asylum: quiet. He does not ask follow-up questions. He files it.",
            "Thraggin on the Soul Siphons: picks one up, examines it for thirty seconds, sets it down. 'Scion work. Clean. Whoever finished this knew what they were doing.' He does not sound entirely happy about this.",
            "Fizzle on all of it: 'We did all of that? We did ALL of that?' She counts on her fingers. She runs out of fingers.",
            "THE MAP: Three threats are circled in red — Draven's field camp to the west, a symbol for Pride at the Palace, a ship symbol for Greed to the south. The party chooses their first target. This is the beginning of the open hunt.",
            "King Kaelen sends a formal commendation to the party via royal messenger during the council. Leocraes reads it, folds it carefully, and puts it in his coat without comment.",
          ],
          dmNote: "The King's commendation landing during the war council — and Leocraes's silent response to it — is the Pride thread pulling taut without announcing itself. He does not say anything. He does not have to. The party will notice. Let them sit with it. The map and the three circled threats are the transition into Act II — the campaign is now open world and the party has agency over the shape of it.",
        },
        {
          title: "The Quiet Beat",
          type: "scene",
          content: "After the war council, after the others have gone, the party returns to the squad house. It is late. The city is quiet in the damaged way that cities are quiet after violence — not peaceful, just exhausted.",
          boxedText: "The squad house is as you left it. Mostly. Someone — Nazura, probably, or one of the Sentinels — has been in to check on things while you were gone. There are fresh candles. The fireplace has been laid but not lit. And in the corner, in the pile of blankets you left for them, the blink pups are asleep. They are bigger than when you left. One of them opens an eye, blinks across the room, lands on someone's foot, and goes back to sleep.",
          dmNote: "This is the quiet personal beat that closes Act I. No objectives, no dice, no enemies. Just the squad house, the pups, the laid fire, and the party together after everything. Ask each player one question: what does your character do in the first hour they are home? Let the answers happen. Someone will light the fire. Someone will sit with a pup. Someone will stand at the window and look at the damaged city for a long time. All of it is correct. Act II begins next session.",
        },
      ],
    }

export default chapter
