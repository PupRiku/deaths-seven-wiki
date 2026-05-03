import type { Chapter } from "@/types"

const chapter: Chapter = {
      number: 15,
      act: 2 as const,
      title: "The Royal Trap",
      levelStart: 16,
      levelEnd: 16,
      summary: "Leocraes calls a private meeting at the squad house. He tells them some of what he knows — not all of it, because he is protecting them, which is the thing he does. Then he takes them to the Old Summer Estate to lay flowers at his mother's shrine. The King sent them there. The guards are not all guards. Leocraes takes a bolt from a crossbow before anyone realizes what is happening. By the time the fight is over, the party knows the King sent assassins, knows the guard captain is a doppelganger, knows the King is something that killed their friend's father and has been wearing his face. They shelter in the ruins overnight with Leocraes bleeding on the floor, and before he loses consciousness he tells them everything.",
      sections: [
        {
          title: "Design Note — A Chapter Without Combat Until It Isn't",
          type: "prose",
          content: "This chapter is almost entirely roleplay and tension until the ambush. The Memory Lane section is load-bearing — the party must love Leocraes completely before the knife drops. Do not rush it. Do not skip moments. The slower this chapter moves before the ambush, the harder the ambush lands. There is no level up in this chapter. The party stays at Level 16. This is a consequence chapter, not a progression chapter.",
          dmNote: "The newer Sentinel doppelganger — choose a Sentinel NPC the party has genuinely interacted with over the campaign. Someone who accompanied them on a side mission, who they had a meal with, who they remembered by name. The reveal should cost something specific. Brief yourself on which interactions that Sentinel was present for and reference one of them during the ambush — the doppelganger using a detail only the real person would know, to demonstrate how long this has been in place.",
        },
        {
          title: "The Squad House Meeting",
          type: "scene",
          content: "Leocraes arrives at the squad house after dark, alone, without royal escort for the first time in months. He looks like someone who has been composing himself for the entire walk over.",
          boxedText: "He sits down at the table — not the head of it, just a chair, like anyone — and he puts both hands flat on the wood and looks at them for a moment. 'I am going to tell you some things,' he says. 'And I am going to ask you to trust that I am not telling you everything, and that the reason is not that I do not trust you.' He looks up. 'The reason is that I am not certain what is safe to say out loud inside a city where I do not know how many ears belong to what.'",
          keyInfo: [
            "WHAT HE TELLS THEM: The King has been different for longer than anyone admits. Not weeks — over a year. Small things at first, dismissed as grief or age. Then larger things. The jewelry store. The conquest edicts. The commendations that named people 'assets.' The silence after Wrath.",
            "WHAT HE DOES NOT TELL THEM: He has a document. He found it three weeks ago in his father's private study, in a place his father kept things he never wanted found. He does not say what it contains. He puts his hand briefly over his coat pocket and then takes it away. He is not ready to say it aloud.",
            "THE INVITATION: 'My father has asked me to visit my mother's shrine at the Summer Estate. Tomorrow. With an escort.' He looks around the table. 'I would like you to be the escort. Not the Royal Guard.' A pause. 'I would like it to be you specifically.'",
            "DC (scaled) Insight: Leocraes is frightened. Not of going — of what it means that he was asked to go. He has worked out part of what it means. He has not worked out all of it.",
            "THE PUPS: If the blink pups are still with the party, one of them blinks onto Leocraes's lap during the meeting and refuses to leave. He sits there with a blink pup on his lap being briefed on a possible assassination attempt. This is both funny and quietly devastating.",
          ],
          dmNote: "The document in his coat pocket is the chapter's first withheld secret. Do not let the party search him or press him on it — he will deflect, gently but firmly. What matters is that they see him touch his coat. The pup on his lap is mandatory if they exist. Leocraes sitting in a squad house kitchen with a blink pup refusing to move while discussing whether his father is trying to kill him is the kind of image this campaign earns.",
        },
        {
          title: "The Journey to the Summer Estate",
          type: "scene",
          content: "The next morning. A few hours' ride from Nova Clarus. The escort is the party, Leocraes, and Captain Vorian with six Royal Guards — assigned by the King, non-negotiable.",
          keyInfo: [
            "CAPTAIN VORIAN: Stoic, loyal, known Leocraes since boyhood. Says little on the road. Positions his guards professionally. Nothing is obviously wrong.",
            "DC (scaled) Perception during the ride: Vorian's patrol positioning is slightly off. The guards are spaced to contain, not protect. A trained soldier would notice. A DC (scaled+2) Insight check on Vorian specifically: something in his eyes when he looks at Leocraes is wrong. Not hostility — blankness. The performance of a person who does not feel what that person would feel.",
            "LEOCRAES ON THE ROAD: He is quieter than usual. He points out landmarks — the hill where he learned to ride, the stream where he and his mother used to catch fish badly. He is saying goodbye to things without saying he is saying goodbye to things.",
            "FIZZLE: She has been unusually quiet since the squad house meeting. She flies close to Leocraes. When he is not looking she checks on him with the particular frequency of someone who can sense something the others cannot.",
          ],
          dmNote: "Fizzle sensing something wrong and not saying anything is her at her best — she is not omniscient but she is attentive, and she has been around death long enough to know its weather. If a player asks Fizzle directly what is wrong, she says: 'I don't know. Probably nothing.' She is not lying. She genuinely does not know. She just feels it.",
        },
        {
          title: "The Memory Lane",
          type: "scene",
          content: "The Summer Estate is overgrown but beautiful. The three stops on the way to the shrine are the chapter's emotional core. Do not rush them.",
          keyInfo: [
            "STOP 1 — THE FIELD OF FLOWERS: Wild violets and white lilies, the same meadow. Leocraes stops and kneels without being asked, picking flowers the same way he described his mother picking them — messy bouquet, taking time, choosing by quality not appearance. He hands individual flowers to each party member without comment. He picks one extra and holds it separately.",
            "STOP 2 — THE TRAINING GROUND: The moss-covered ring. He picks up a wooden sword from the rotting rack and gives it one swing — not performative, just reflexive, the muscle memory of a thousand hours. He looks at it. 'He used to let me win,' he says. Not to anyone specifically. 'I figured it out when I was twelve. I didn't say anything because I didn't want him to stop.' He puts the sword back.",
            "STOP 3 — THE GAZEBO: The clifftop gazebo. Queen Elara's shrine. He places the bouquet and the single extra flower separately — the bouquet for his mother, the flower for something else, something he does not explain. He closes his eyes. The party can hear the estate grounds. Birds. Wind. Nothing wrong yet.",
          ],
          dmNote: "The extra flower placed separately is for his father — the real one, the one who used to let him win and watch sunsets here. He is mourning someone who is not dead yet but whom he has already lost. If a player asks about the extra flower, he looks at it for a moment and then says: 'In case.' That is all he says. Give the table the gazebo scene in full. Let Leocraes finish his prayer before anything happens. He deserves that.",
        },
        {
          title: "The Ambush",
          type: "scene",
          content: "Leocraes finishes his prayer. He turns to leave. A crossbow bolt takes him in the shoulder.",
          boxedText: "He stumbles back into the shrine. The bolt is in deep — not a warning shot. Captain Vorian stands at the edge of the garden, crossbow still raised, six guards drawing swords around the perimeter. 'I am sorry, my Prince,' Vorian says. His voice has no affect. No guilt. No hesitation. 'The King has decreed that the past must die so the future may ascend.' He reaches up and touches the side of his neck — a quick, specific gesture — and his face melts. Just slightly. Just enough. The skin goes gray and rubbery at the jaw. He catches it and holds it. He is not Vorian. He has not been Vorian for some time.",
          dmNote: "The face melting just slightly and him catching it is the key visual. He is in control enough to maintain the disguise through the gesture — but the party saw it. That flicker. That is the proof. Run the ambush immediately after this — no pause for reaction, initiative is called.",
        },
        {
          title: "Encounter — The Ambush",
          type: "encounter",
          content: "The party is in a clifftop gazebo with a critically injured Leocraes, surrounded by six Royal Guards and a Doppelganger commanding them. The terrain is the estate garden — flower beds, stone paths, the cliff edge thirty feet behind the gazebo.",
          creatures: [
            "Vorian — Doppelganger Assassin: Use Assassin stat block. Fights with lethal precision, targets Leocraes for the killing blow if he gets a clean line.",
            "4 Royal Guard Veterans: Use Veteran stat block. Fight professionally — flanking, covering each other.",
            "2 Royal Guard Veterans who are ALSO Doppelgangers — revealed when first reduced below 30 HP. Their faces slip. They continue fighting.",
            "THE NEWER SENTINEL DOPPELGANGER: At the start of Round 2, a figure emerges from the tree line — someone the party recognizes, a Sentinel they have worked with and trusted. They call out a detail only the real person would know. They raise a weapon. This is the second reveal. The real Sentinel's fate is unknown.",
          ],
          tactics: "The primary objective is keeping Leocraes alive — he is at 0 HP and making death saves from Round 1. Each Round a party member does not use their action to stabilize him, he makes a death save. Three failures ends the chapter badly. Vorian prioritizes Leocraes — any round he has a clear line he attempts a coup de grace. The cliff edge is a hazard — pushed characters make DC (scaled) Athletics to catch themselves. The two guard doppelgangers revealing mid-combat is the tactical reset moment — the party must reassess who they are fighting.",
          dmNote: "The Sentinel doppelganger using a specific real detail — something from an actual session, an actual moment — is the scene's emotional knife. The party recognized them. They trusted them. Whatever that detail is, make it specific and make it right. The real Sentinel is alive somewhere. That thread can be followed in the Pride chapter.",
        },
        {
          title: "When Vorian Falls",
          type: "scene",
          content: "When the Vorian doppelganger is reduced to 0 HP, it does not bleed. The face dissolves entirely — gray rubbery flesh, featureless, the performance finally over.",
          boxedText: "The face goes last. It holds the shape of Vorian's features even as the body fails — then releases all at once, gray and smooth and featureless, a thing that wore a person for long enough that the person's absence is its own kind of horror. The real Vorian is somewhere. Probably not alive. The King sent this thing to a private family shrine with a crossbow.",
          dmNote: "The party now has proof. Not the kind of proof that convinces a court — a dead shapeshifter and the testimony of people the King just tried to murder. But they know. They have known for a while. Now they know for certain.",
        },
        {
          title: "The Night in the Ruins",
          type: "scene",
          content: "Leocraes cannot be moved safely. The party shelters in the estate's most intact room — a stone sitting room off the main hall, walls still standing, roof mostly intact. They make a fire from the furniture.",
          boxedText: "The fire is small. Outside, the estate is quiet — whatever the King sent, it has been dealt with, and whatever comes next has not arrived yet. Leocraes is on the floor with his back against the wall, stabilized but not well, his breathing careful and deliberate. The bolt is out. The wound is packed. He has been watching the fire for a long time without speaking. Then: 'The document.' His hand finds his coat. 'I should have shown you at the meeting. I was — I thought I was protecting you.' He takes it out. 'I was protecting myself.'",
          dmNote: "Leocraes admitting he was protecting himself is the most honest thing he has said in the entire campaign. He has been right for the wrong reasons since Chapter 2. Here, barely conscious, bleeding in the ruins of his childhood home, he finally says the true thing. Give Will — and the table — a moment with that before he continues.",
        },
        {
          title: "What Leocraes Knows",
          type: "scene",
          content: "The document is a letter. Old, in his father's handwriting — the real handwriting, from before. It was written to be found after his death. It was found too early.",
          boxedText: "The letter is addressed to him. It begins: 'Leo. If you are reading this before I am gone, something has gone wrong. There is a thing wearing my face. I do not know when it began. I know that I began to notice it had been there for some time before I realized what I was noticing.' It goes on. The handwriting deteriorates toward the end. The last line reads: 'I love you. I have always loved you. Whatever is on the throne is not me. Do not mourn it. Find someone who can end it. And Leo — be careful. It knows you suspect. It has been waiting to see what you do with that.'",
          keyInfo: [
            "THE KING KNEW: The real King Kaelen was aware he had been replaced. He hid the letter before the doppelganger could prevent it.",
            "THE TIMELINE: The real King has been dead for over a year. Every interaction the party has had with 'the King' has been the Sin of Pride wearing his face.",
            "THE DOPPELGANGER'S STRATEGY: It has been using the party to eliminate threats to its power — Greed was economic competition, Wrath was military competition, the other Sins were destabilizing forces. It has been patient and deliberate and it has been using them.",
            "WHAT LEOCRAES WANTS: 'I do not want the throne,' he says. Very clearly. 'I want my father's name given back to him. I want that thing off it. I want Nova Clarus to know what happened.' He pauses. 'After that — I do not care about the rest.'",
            "THE PARTY'S SITUATION: The King knows they survived. The doppelganger is on the throne with the city's military at its disposal. They have proof that is real but inadmissible. They have nowhere safe except each other.",
          ],
          dmNote: "The real King having known and written the letter is the chapter's final gut punch. He was helpless — replaced, unable to act, able only to leave a note for his son to find. 'Do not mourn it.' He knew his son would mourn. He told him not to anyway. Let the table sit with the letter for as long as they need. Then Leocraes's eyes close. His breathing steadies — sleep, not unconsciousness. He is going to survive. The chapter ends here.",
        },
        {
          title: "Dawn",
          type: "scene",
          content: "Morning comes. Leocraes is alive. The fire is coals. The estate is quiet around them and the city is two hours away and the King is on the throne knowing they survived and deciding what to do about it.",
          boxedText: "The sun comes through the cracked window and falls across the floor and across Leocraes asleep against the wall and across the letter still in someone's hand. Outside, somewhere in the overgrown garden, a bird is singing. It does not know what happened here. It just sings. Fizzle, who has not slept, is sitting in the window looking at the city on the horizon. She turns when she hears someone stir. 'He's going to be okay,' she says. She has been saying it all night to herself. It helps to say it to someone else.",
          keyInfo: [
            "NEXT STEPS: The party must return to Nova Clarus, protect Leocraes, and confront the doppelganger king — but carefully. The city does not know. The military does not know. Pride has had over a year to consolidate its position.",
            "THE REAL VORIAN: His fate is unknown. He may be alive somewhere in the palace dungeons. Finding him — if he is alive — would give the party a credible witness.",
            "NO LEVEL UP: This chapter has no advancement. The party enters Chapter 16 at Level 16, exactly as they left Chapter 15. They carry the letter. They carry Leocraes. They carry what they now know.",
          ],
          dmNote: "Fizzle saying 'He's going to be okay' to herself all night and then saying it to someone else when they wake is her at her most human. She has been the party's guide and their chaos pixie and their window into Nyx since the first field. She sat up all night saying a thing into the dark because saying it helped. That is Fizzle. That is the end of the chapter.",
        },
      ],
    }

export default chapter
