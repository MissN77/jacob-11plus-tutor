// ── READING BETWEEN THE LINES ────────────────────────────────────────────────
// Inference taught as a set of NAMED, SEPARATE skills rather than "what does
// the writer mean". Jacob reads literally, so every explanation shows the
// reasoning out loud in the same three steps:
//
//     the clue in the text  ->  what that clue usually means  ->  therefore
//
// That way the answer is never "you just sense it". There is always something
// on the page he can point at.
//
// All extracts are written for this app. Nothing is taken from a published book.
(function (root) {
  'use strict';

  const SKILLS = [
    {
      id: 'colour', name: 'What Colours Tell You', icon: '\u{1F3A8}',
      rule: 'Writers pick colours for how they make you feel, not to help you draw the picture.',
      points: [
        'Grey, black and brown feel heavy, sad, tired or dirty.',
        'Gold, white and bright blue feel clean, hopeful, safe or rich.',
        'Red is the loud one. It means danger, anger or blood, but sometimes warmth.',
        'Watch for a colour DRAINING away, "the colour went out of the sky". That is a mood falling.',
        'Ask yourself: if this scene were a film, what music would be playing?'
      ],
      example: {
        text: 'The waiting room was painted the grey of old dishwater, and the one window had been bricked up years ago.',
        q: 'How is this room meant to feel?',
        steps: [
          'The clue is the colour: "the grey of old dishwater". Not just grey, but dirty used-up grey.',
          'Grey with no light in it usually means hopeless or worn out.',
          'The bricked-up window removes the last source of light, so nothing is coming in.'
        ],
        a: 'Hopeless and closed in. Nobody is meant to feel better in that room.'
      },
      qs: [
        { text: 'The sky above the harbour had gone the colour of wet slate, and the gulls had stopped calling.',
          q: 'What is about to happen?', opts: ['A storm', 'A sunny afternoon', 'A festival', 'Nothing at all'], ans: 0,
          why: 'The clue is the colour, wet slate, which is dark grey. Dark grey sky usually means rain coming. The second clue is the gulls going quiet, and animals go quiet before bad weather. Both point the same way.' },
        { text: 'She opened the curtains and the room filled with a thin gold light.',
          q: 'How does the writer want the moment to feel?', opts: ['Hopeful and new', 'Frightening', 'Angry', 'Boring'], ans: 0,
          why: 'The clue is gold light. Gold is a warm, valuable colour. Light arriving where there was none usually means things are getting better, so the mood is hopeful.' },
        { text: 'Everything in the house was brown: the carpet, the curtains, the photographs, even the air.',
          q: 'What does all that brown suggest?', opts: ['The house is stuck in the past', 'The house is brand new', 'The house is very colourful', 'The owner loves gardening'], ans: 0,
          why: 'The clue is one dull colour repeated over and over, and especially "even the air", which cannot really be brown. When everything is the same faded colour, nothing has changed for a long time.' },
        { text: 'A single red coat moved through the crowd of black umbrellas.',
          q: 'Why does the writer make the coat red?', opts: ['So that one person stands out from everyone else', 'Because red coats are warm', 'To show it was raining', 'To describe the weather'], ans: 0,
          why: 'The clue is one colour against many. Red against black is the strongest contrast there is. A writer who gives one person a different colour is telling you to watch that person.' },
        { text: 'By the time he reached the top of the hill, all the colour had gone out of the afternoon.',
          q: 'What has changed?', opts: ['The mood has dropped, and the day feels over', 'He has gone blind', 'It has started snowing', 'He has climbed very fast'], ans: 0,
          why: 'Colour cannot literally leave an afternoon, so this is about feeling. Colour draining away means life and warmth draining away, so the mood has fallen.' },
        { text: 'The hospital corridor was white, white, white, and smelled of nothing at all.',
          q: 'What feeling does this create?', opts: ['Cold and empty', 'Cosy and welcoming', 'Exciting', 'Funny'], ans: 0,
          why: 'White repeated three times makes it feel endless. White can mean clean, but with no smell and nothing else in it, nothing human is there. That makes it cold rather than fresh.' },
        { text: 'The last of the sun turned the wet road to copper.',
          q: 'What does "copper" tell you about the light?', opts: ['It was a warm orange-brown glow', 'The road was made of metal', 'It was very cold', 'The road was broken'], ans: 0,
          why: 'Copper is an orange-brown metal that shines. The writer is describing the colour and the shine of low evening sun on a wet surface, not what the road is made of.' },
        { text: 'She wore the same green cardigan every day of that terrible year, and after it was over she never wore green again.',
          q: 'What does the green cardigan become?', opts: ['A reminder of a bad time', 'Her favourite item of clothing', 'A gift from a friend', 'Proof she liked knitting'], ans: 0,
          why: 'The clue is that she stopped wearing green afterwards. If the colour itself became unbearable, it must be tied to the memory. The cardigan has stopped being clothing and become a reminder.' }
      ]
    },

    {
      id: 'weather', name: 'Weather and Setting', icon: '\u{1F327}️',
      rule: 'When the weather matches the mood, the writer put it there on purpose.',
      points: [
        'Storms, wind and rain usually mean trouble, anger or fear.',
        'Still air, sunshine and warmth usually mean safety, calm or relief.',
        'Fog and mist mean not knowing, or something hidden.',
        'Cold usually means loneliness or death; heat can mean anger or pressure building.',
        'A sudden change in the weather often marks a change in the story.'
      ],
      example: {
        text: 'The wind got up as he walked towards the house, and by the time he reached the gate it was pulling at his coat.',
        q: 'What is the weather doing for the story?',
        steps: [
          'The clue is the timing: the wind rises as he approaches, not before.',
          'Rising wind usually means trouble building.',
          'The wind "pulling at his coat" makes it feel like something trying to hold him back.'
        ],
        a: 'It is warning you that something bad is waiting at the house.'
      },
      qs: [
        { text: 'The fog came down so thickly that he could not see the end of his own street.',
          q: 'What does the fog suggest, apart from the weather?', opts: ['He does not know what is coming', 'He is very happy', 'It is a hot day', 'He is going on holiday'], ans: 0,
          why: 'The clue is not being able to see ahead. Not seeing ahead is what NOT KNOWING feels like. Writers use fog when a character is about to face something they cannot predict.' },
        { text: 'It rained for the whole funeral, and then the sun came out as they walked back to the cars.',
          q: 'Why does the writer put the sun at that exact moment?', opts: ['To mark the worst part being over', 'To describe a typical British day', 'To show the rain was a mistake', 'To show they were late'], ans: 0,
          why: 'The clue is the timing again. The sun does not arrive during the funeral, it arrives after. A change in weather at a change in the story usually means the mood has turned.' },
        { text: 'The classroom was so hot that nobody could sit still, and by the afternoon two fights had broken out.',
          q: 'What is the heat doing here?', opts: ['Building up pressure until people snap', 'Making everyone sleepy and calm', 'Helping them concentrate', 'Nothing at all'], ans: 0,
          why: 'The clue is the order: heat first, fights after. Heat that nobody can escape makes people irritable, so the writer uses it to build pressure until something breaks.' },
        { text: 'There was no wind at all. The washing hung dead straight on the line.',
          q: 'What is the stillness suggesting?', opts: ['Something is about to happen', 'It is a lovely day for drying clothes', 'A storm has just finished', 'Nobody lives there'], ans: 0,
          why: 'The clue is the word "dead" inside a description of nothing moving. Complete stillness is unnatural and uncomfortable, which is why writers use it just before something happens.' },
        { text: 'Frost had got into the house overnight and lay on the inside of the windows.',
          q: 'What does frost INSIDE tell you?', opts: ['Nobody has been keeping the place warm', 'The family are wealthy', 'It is the middle of summer', 'The windows are new'], ans: 0,
          why: 'Frost on the inside means the house is as cold indoors as out. That only happens when there is no heating, which usually means no money or nobody living there properly.' },
        { text: 'They set off under a clear blue sky, with the whole day in front of them.',
          q: 'How is the journey meant to feel at this point?', opts: ['Full of promise', 'Doomed', 'Rushed', 'Frightening'], ans: 0,
          why: 'Two clues agree: a clear sky, and "the whole day in front of them". Both suggest nothing in the way yet. A writer opens like this when things are about to go well, or to make a later disaster land harder.' },
        { text: 'The tide had gone out further than he had ever seen it go, and the beach was silent.',
          q: 'What should you expect?', opts: ['Something dangerous is coming', 'A lovely afternoon of swimming', 'A shopping trip', 'Nothing will happen'], ans: 0,
          why: 'The clue is "further than he had ever seen". The word "ever" flags it as abnormal, and abnormal things in stories are warnings. Silence with it makes two warnings.' },
        { text: 'Inside the kitchen it was warm, and there was a smell of toast.',
          q: 'What is the writer telling you about this house?', opts: ['It is a safe place', 'It is dangerous', 'It is abandoned', 'It is very grand'], ans: 0,
          why: 'Two clues, warmth and the smell of ordinary food. Both are things you notice when you feel looked after. The writer is making the kitchen feel safe before anything happens.' }
      ]
    },

    {
      id: 'wordchoice', name: 'The Exact Word Chosen', icon: '\u{1F58A}️',
      rule: 'Two words can mean nearly the same thing and feel completely different. The writer chose ONE of them.',
      points: [
        'Compare the word to a plainer one: he "strode" in, or he "walked" in. Strode is faster and more certain.',
        '"Muttered" and "announced" both mean said, but one hides and one shows off.',
        'A strong verb tells you the feeling without the writer naming it.',
        'Ask: what OTHER word could they have used, and why did they not?',
        'If a word seems too big or too small for the moment, that is deliberate.'
      ],
      example: {
        text: 'She placed the letter on the table. He snatched it up.',
        q: 'What do "placed" and "snatched" tell you?',
        steps: [
          'The clue is the pair of verbs, put next to each other on purpose.',
          'Placed is slow and careful. Snatched is fast and greedy.',
          'The writer could have written "put" and "took" and told you nothing.'
        ],
        a: 'She is calm and in control. He is desperate.'
      },
      qs: [
        { text: 'He shuffled into the room.',
          q: 'What does "shuffled" suggest about him?', opts: ['He is old, tired or reluctant', 'He is in a hurry', 'He is confident', 'He is angry'], ans: 0,
          why: 'Shuffling means the feet barely leave the floor. People walk like that when they are old, exhausted, or do not want to arrive. A confident person strides.' },
        { text: '"Fine," she said.',
          q: 'What does the full stop after "Fine" suggest?', opts: ['She is not fine', 'She is delighted', 'She is asking a question', 'She did not hear'], ans: 0,
          why: 'The clue is how short it is. One word and a full stop shuts the conversation down. Someone who is genuinely fine usually says more than one word.' },
        { text: 'The head teacher summoned him.',
          q: 'Why "summoned" rather than "asked to see"?', opts: ['It shows he had no choice and is in trouble', 'It shows they are friends', 'It shows the meeting is optional', 'It shows he was late'], ans: 0,
          why: 'Summoned is a word used for courts and kings. It carries power and no choice. Asked to see would be gentle, and the writer did not want gentle.' },
        { text: 'A crowd had gathered. A mob had gathered.',
          q: 'What changes between those two sentences?', opts: ['A mob sounds dangerous and out of control', 'They mean exactly the same', 'A mob is smaller', 'A mob is better behaved'], ans: 0,
          why: 'Both words mean a lot of people. Crowd is neutral, you get one at a bus stop. Mob carries anger and violence with it, so swapping the word changes the danger without changing the facts.' },
        { text: 'He admitted he had taken it. He confessed he had taken it.',
          q: 'What does "confessed" add?', opts: ['A sense of guilt and wrongdoing', 'That he is joking', 'That he is proud', 'Nothing at all'], ans: 0,
          why: 'Admitted just means he agreed it was true. Confessed is the word used for crimes and sins, so it adds guilt that admitted does not carry.' },
        { text: 'The old man clutched the photograph.',
          q: 'What does "clutched" tell you?', opts: ['It matters to him enormously', 'He is about to throw it away', 'He has just found it', 'He does not care about it'], ans: 0,
          why: 'Clutching is holding tightly, the way you hold something you are afraid to lose. If he did not care, the writer would have used "held".' },
        { text: 'She smiled. Her eyes did not.',
          q: 'What is the writer telling you?', opts: ['The smile is not genuine', 'She is very happy', 'She is blind', 'She is about to cry'], ans: 0,
          why: 'The clue is the second sentence contradicting the first. A real smile reaches the eyes. Splitting them into two sentences makes you notice the gap between what she shows and what she feels.' },
        { text: 'The company said the closure was "a difficult decision".',
          q: 'Who is the phrase "a difficult decision" designed to make you feel sorry for?', opts: ['The company', 'The workers', 'The customers', 'Nobody'], ans: 0,
          why: 'The clue is whose difficulty is being described. Losing your job is hard; making the decision is being called hard instead. The phrase quietly moves the sympathy to the people doing it.' }
      ]
    },

    {
      id: 'bodylanguage', name: 'What Bodies Tell You', icon: '\u{1F440}',
      rule: 'Writers show feelings through what a body does, because people hide what they say but not what they do.',
      points: [
        'Hands: shaking means fear or cold, clenched means anger, hidden means something to hide.',
        'Eyes: looking away means shame, lying or discomfort; staring means challenge or shock.',
        'Distance: stepping back means fear or dislike, stepping closer means care or threat.',
        'Speed: doing something slowly can mean dread. Doing it fast can mean panic or eagerness.',
        'When a body and the words disagree, believe the body.'
      ],
      example: {
        text: '"I do not mind," he said, folding his arms.',
        q: 'Does he mind?',
        steps: [
          'The clue is the mismatch. The words say one thing, the arms say another.',
          'Folded arms is a closed, defensive position.',
          'When words and body disagree, the body is the honest one.'
        ],
        a: 'Yes, he minds a great deal.'
      },
      qs: [
        { text: 'He answered every question while staring at the carpet.',
          q: 'What does this suggest?', opts: ['He is uncomfortable or hiding something', 'He is very confident', 'He finds the carpet interesting', 'He cannot hear them'], ans: 0,
          why: 'The clue is where he is NOT looking. People meet your eyes when they are comfortable. Looking down for a whole conversation shows shame, fear or something being kept back.' },
        { text: 'Her hands were perfectly still in her lap.',
          q: 'In a tense scene, what does perfect stillness suggest?', opts: ['She is controlling herself with effort', 'She has fallen asleep', 'She is relaxed and carefree', 'She is cold'], ans: 0,
          why: 'The clue is the word "perfectly". Ordinary calm is not perfect, it fidgets a bit. Perfect stillness during tension means she is holding herself that way on purpose.' },
        { text: 'When his father came in, the boy moved to the far side of the room.',
          q: 'What does the movement tell you?', opts: ['He is wary of his father', 'He wants a better seat', 'He is going to hug him', 'He is looking for something'], ans: 0,
          why: 'The clue is the direction: away, and as far as possible. Distance is what people put between themselves and something they fear or dislike.' },
        { text: 'She read the letter twice, then put it in her pocket without a word.',
          q: 'What does reading it twice suggest?', opts: ['It contained something serious', 'She cannot read well', 'It was very funny', 'It was blank'], ans: 0,
          why: 'Reading something twice means the first reading was not enough. That happens with news that is hard to take in. Saying nothing afterwards doubles the signal.' },
        { text: 'He laughed a beat too late.',
          q: 'What does the delay tell you?', opts: ['He did not find it funny and is pretending', 'He has a hearing problem', 'The joke was brilliant', 'He was not listening at all'], ans: 0,
          why: 'Real laughter is immediate, you cannot help it. A delay means he worked out that a laugh was expected and produced one. "A beat too late" is the writer pointing at exactly that gap.' },
        { text: 'The whole table went quiet when she said the name.',
          q: 'What does the silence mean?', opts: ['The name matters and everyone knows why', 'Nobody heard her', 'They were all eating', 'The name is boring'], ans: 0,
          why: 'The clue is that everyone reacts at once. A roomful of people falling silent together means they all share knowledge about that name, and it is not good.' },
        { text: 'He kept checking the door.',
          q: 'What is he feeling?', opts: ['He is anxious, expecting someone or wanting to leave', 'He is admiring the woodwork', 'He is completely relaxed', 'He is asleep'], ans: 0,
          why: 'The clue is "kept", meaning again and again. Repeated glances at an exit mean either someone is expected or he wants out. Either way it is anxiety.' },
        { text: 'She held out her hand. He looked at it, and then at her, and did not take it.',
          q: 'What has just happened?', opts: ['He has refused to make peace', 'He has forgotten her name', 'He cannot see well', 'He is being polite'], ans: 0,
          why: 'The clue is the pause before the refusal. He looked at the hand, so he understood the offer. Choosing not to take it is a decision, and refusing a handshake is a refusal of the person.' }
      ]
    },

    {
      id: 'figurative', name: 'When Words Do Not Mean What They Say', icon: '\u{1F300}',
      rule: 'Some sentences are not literally true, and are not meant to be. They are comparisons.',
      points: [
        'A SIMILE says something is LIKE something else: "as cold as a church".',
        'A METAPHOR says it IS the other thing: "the class was a zoo". Nobody thinks there were lions.',
        'PERSONIFICATION gives a thing human behaviour: "the wind screamed".',
        'When a sentence cannot be literally true, stop and ask what the two things have in common.',
        'That shared quality IS the meaning. A zoo and the class share noise and chaos.'
      ],
      example: {
        text: 'His voice was gravel.',
        q: 'What does this mean?',
        steps: [
          'It cannot be literally true. A voice is not made of stone.',
          'So ask what gravel is like: rough, scratchy, low, harsh.',
          'Those qualities are what is being lent to his voice.'
        ],
        a: 'His voice was rough and harsh, not that it was made of stone.'
      },
      qs: [
        { text: 'The classroom was a zoo.',
          q: 'What does this actually mean?', opts: ['It was noisy and out of control', 'There were animals in it', 'It smelled bad', 'It had bars on the windows'], ans: 0,
          why: 'It cannot be literally true. Ask what a zoo is like: loud, wild, lots happening at once. Those are the qualities being given to the classroom.' },
        { text: 'The old tractor coughed twice and died.',
          q: 'What happened?', opts: ['The engine spluttered and stopped', 'The tractor was ill', 'Somebody killed it', 'It needed a doctor'], ans: 0,
          why: 'Tractors cannot cough or die, so this is personification. Coughing means the uneven noise of a failing engine and dying means it stopped. Machines are often described as if alive.' },
        { text: 'Her news was a bucket of cold water over the whole evening.',
          q: 'What did the news do?', opts: ['It ruined the mood instantly', 'It made everyone wet', 'It cooled the room down', 'It made everyone laugh'], ans: 0,
          why: 'Nobody threw water. Ask what cold water over you does: it shocks you and stops everything at once. That is what her news did to the mood.' },
        { text: 'The queue crawled.',
          q: 'What is being said?', opts: ['It moved extremely slowly', 'People were on their hands and knees', 'The queue was for babies', 'It was going backwards'], ans: 0,
          why: 'A queue has no legs, so it cannot crawl. Crawling is the slowest way of moving, so the writer means the queue barely moved.' },
        { text: 'He was a wall.',
          q: 'What does this suggest about him?', opts: ['He would not let anything through or give anything away', 'He was made of brick', 'He was very wide', 'He was falling down'], ans: 0,
          why: 'A person is not a wall, so ask what a wall does: it blocks things and does not move. That is what he does, either physically or by refusing to talk.' },
        { text: 'Silence sat between them like a third person at the table.',
          q: 'What is the writer doing here?', opts: ['Making the silence feel solid and impossible to ignore', 'Describing an actual guest', 'Saying the table was too small', 'Saying they were waiting for someone'], ans: 0,
          why: 'Silence cannot sit anywhere. Comparing it to a person at the table makes it something they can both feel and have to work around, rather than just an absence of talking.' },
        { text: 'The exam paper stared back at him.',
          q: 'Why describe it this way?', opts: ['To show how threatening the blank paper felt', 'To say the paper had eyes', 'To say the paper was upside down', 'To show the room was bright'], ans: 0,
          why: 'Paper cannot stare. Being stared at feels like a challenge you cannot look away from, which is exactly how an exam you cannot answer feels.' },
        { text: 'Hope is the thing you pack last and lose first.',
          q: 'What is this sentence saying?', opts: ['Hope is easy to lose when things go wrong', 'Hope is a piece of luggage', 'You should pack more carefully', 'Hope weighs very little'], ans: 0,
          why: 'Hope cannot be packed, so it is being treated as an object. Packed last means you hold onto it until the end; lost first means it goes as soon as trouble starts.' }
      ]
    },

    {
      id: 'sayings', name: 'Sayings and Idioms', icon: '\u{1F5E3}️',
      rule: 'An idiom is a phrase everyone agrees means something other than its words. You cannot work it out from the words alone, so these have to be learned.',
      points: [
        'If a sentence sounds odd taken literally, it is probably an idiom.',
        '"It cost an arm and a leg" means it was expensive, not that anyone lost a limb.',
        'Idioms rarely change: it is always "spill the beans", never "spill the peas".',
        'If you do not know one, look at the situation around it for the clue.',
        'Keeping a list of the ones you meet is the only real way to learn them.'
      ],
      example: {
        text: 'When I asked about the party, my sister let the cat out of the bag.',
        q: 'What did the sister do?',
        steps: [
          'Taken literally there is no cat and no bag, so it is an idiom.',
          'The situation is about a party that was supposed to be a secret.',
          'The phrase is the well-known one for revealing a secret.'
        ],
        a: 'She gave away the secret.'
      },
      qs: [
        { text: 'After three hours of arguing they finally buried the hatchet.',
          q: 'What did they do?', opts: ['Made peace', 'Dug a hole in the garden', 'Started fighting', 'Bought a tool'], ans: 0,
          why: 'No hatchet was buried. The clue is "after three hours of arguing they finally", which tells you the argument ended. The idiom means to make peace.' },
        { text: 'I was a bit under the weather so I stayed home.',
          q: 'What was wrong?', opts: ['He felt unwell', 'He was outside in the rain', 'He was sad about the forecast', 'He was very busy'], ans: 0,
          why: 'Weather has nothing to do with it. The clue is "so I stayed home", which is what people do when they are ill. Under the weather means slightly unwell.' },
        { text: 'Learning the violin was hard at first, but she stuck at it and now she plays beautifully.',
          q: 'What does "stuck at it" mean?', opts: ['She kept going despite the difficulty', 'She glued something', 'She gave up', 'She got trapped'], ans: 0,
          why: 'Nothing was glued. The clue is the contrast between "hard at first" and "now she plays beautifully". Something had to happen in between, and that something is persistence.' },
        { text: 'Do not count your chickens before they hatch.',
          q: 'What is this advice about?', opts: ['Do not assume something has worked before it actually has', 'Keep better track of your farm animals', 'Eggs are unreliable', 'Chickens are hard to count'], ans: 0,
          why: 'It is a saying, not farming advice. An egg is not yet a chicken, so counting it is counting something you do not have. The lesson is not to rely on a result before it happens.' },
        { text: 'He told me to break a leg before I went on stage.',
          q: 'What did he mean?', opts: ['Good luck', 'He wanted me to be hurt', 'The stage was broken', 'I should sit down'], ans: 0,
          why: 'The clue is "before I went on stage". Nobody wishes an injury on a performer. This is the theatre way of saying good luck, because saying good luck was thought unlucky.' },
        { text: 'She was over the moon about her results.',
          q: 'How did she feel?', opts: ['Delighted', 'Confused', 'Disappointed', 'Frightened'], ans: 0,
          why: 'Nobody goes over the moon. The clue is "about her results", and the phrase means extremely pleased. Being high up is often used for happiness.' },
        { text: 'That is the last straw, said Mum, and switched the television off.',
          q: 'What does "the last straw" mean?', opts: ['The final annoyance in a long series', 'A drinking straw has run out', 'The best thing that happened', 'Something to do with farming'], ans: 0,
          why: 'The clue is her reaction, switching it off in temper. The full saying is about the straw that breaks the camel’s back: one small thing on top of many, and that is what finally causes the reaction.' },
        { text: 'I will have to bite the bullet and tell her tomorrow.',
          q: 'What does this mean?', opts: ['Do the unpleasant thing because there is no way round it', 'Eat something hard', 'Fire a gun', 'Put it off for longer'], ans: 0,
          why: 'The clue is "I will have to" and "tell her", which sounds like bad news. The idiom means bracing yourself and getting on with something painful.' }
      ]
    },

    {
      id: 'notsaid', name: 'What Is NOT Said', icon: '\u{1F910}',
      rule: 'A gap can carry meaning. Pay attention to what a character avoids, and to what the writer leaves out.',
      points: [
        'If someone answers a different question from the one asked, they are dodging it.',
        'A pause, a change of subject, or "anyway…" is usually avoidance.',
        'If the writer skips over an event, ask yourself why it was too painful or too obvious to show.',
        'A character who says nothing at a big moment is still telling you something.',
        'Listen for the question that nobody asks.'
      ],
      example: {
        text: '"Did you break it?" she asked. "It was already cracked," he said.',
        q: 'Did he break it?',
        steps: [
          'The clue is that he does not answer the question asked.',
          'She asked if he broke it. He talked about its earlier condition instead.',
          'An innocent person says no. He avoided saying no.'
        ],
        a: 'Almost certainly yes, and he is trying not to say so.'
      },
      qs: [
        { text: '"How was the exam?" "Have you seen my blue jumper anywhere?"',
          q: 'What does the reply tell you?', opts: ['It probably went badly and he does not want to discuss it', 'He has lost a jumper and nothing more', 'He did not hear the question', 'The exam went brilliantly'], ans: 0,
          why: 'The clue is that the answer has nothing to do with the question. Changing the subject that sharply means the first subject is one he wants closed.' },
        { text: 'She talked happily about her new job for twenty minutes and never once mentioned her old one.',
          q: 'What does the gap suggest?', opts: ['Something went wrong at the old job', 'She has forgotten it entirely', 'She was too busy talking', 'The old job was excellent'], ans: 0,
          why: 'The clue is "never once" across twenty minutes. Avoiding a subject that completely takes effort, and people only make that effort for subjects that hurt.' },
        { text: 'The letter thanked him for his years of service and wished him well. It did not say why he was leaving.',
          q: 'Why does the missing reason matter?', opts: ['It suggests he did not leave by choice', 'It means the writer forgot', 'It proves he was promoted', 'It shows the letter was short'], ans: 0,
          why: 'The clue is the writer telling you what is absent. A normal goodbye letter mentions retirement or a new job. Leaving out the reason is how you avoid saying he was pushed.' },
        { text: 'He described the whole holiday except for the Thursday.',
          q: 'What should you conclude?', opts: ['Something happened on the Thursday he does not want to share', 'Thursday was boring', 'He cannot remember Thursday', 'The holiday was only six days long'], ans: 0,
          why: 'The clue is the word "except". One missing day inside a complete account is deliberate. If it were boring he would say it was boring.' },
        { text: '"You always support me." Silence.',
          q: 'What does the silence do?', opts: ['It contradicts what was just said', 'It agrees enthusiastically', 'It means nobody was there', 'It means she did not hear'], ans: 0,
          why: 'The clue is where the silence falls. A statement like that expects a yes. Getting nothing back is the same as being told no, without anybody having to say it.' },
        { text: 'The report listed every department except the one where the fire started.',
          q: 'What does the omission suggest?', opts: ['Somebody is protecting that department', 'The department did not exist', 'It was an accident of alphabetical order', 'The fire was not important'], ans: 0,
          why: 'The clue is which one is missing: the single most relevant one. When the missing item is the important one, the gap has been made on purpose.' },
        { text: 'Whenever the subject of his father came up, he would look at his watch.',
          q: 'What is he doing?', opts: ['Signalling he wants the conversation to end', 'Checking he is not late', 'Showing off his watch', 'Trying to remember the date'], ans: 0,
          why: 'The clue is "whenever", which makes it a pattern rather than a one-off. Checking the time is the polite way of saying you want to leave, and it happens on one subject only.' },
        { text: 'The story ends with the door closing. We are never told what happened inside.',
          q: 'Why would a writer end there?', opts: ['To make the reader imagine it, which is stronger than being told', 'Because they ran out of ideas', 'To save paper', 'Because nothing happened'], ans: 0,
          why: 'The clue is that the writer stops at the most interesting moment, which is a choice. What you imagine is worse and more personal than anything written down.' }
      ]
    },

    {
      id: 'motive', name: 'Why People Do Things', icon: '\u{1F9ED}',
      rule: 'Characters rarely explain themselves. You work out WHY from what they do, and from what they gain.',
      points: [
        'Ask who benefits. The person who gains is usually the person who chose.',
        'Look at what they do when they think nobody is watching. That is the real them.',
        'Compare what they say with what they actually do. Where these differ, believe the doing.',
        'A sudden change of behaviour has a cause, even if the cause is off the page.',
        'People act from fear, love, money, pride or guilt far more often than from pure evil.'
      ],
      example: {
        text: 'He offered to carry her bag, then walked her all the way to her gate, then asked whether her brother was home.',
        q: 'What was he really doing?',
        steps: [
          'The clue is the order of the three actions building to the last one.',
          'The first two are kind, but they are also how you get to her gate.',
          'The question at the end is what he wanted all along.'
        ],
        a: 'He wanted to find out about the brother, and the kindness was the route to it.'
      },
      qs: [
        { text: 'She volunteered to tidy the stockroom, which nobody ever did, on the one afternoon the safe was left open.',
          q: 'What should you suspect?', opts: ['She wanted to be alone near the safe', 'She really likes tidying', 'She was told to do it', 'She was bored'], ans: 0,
          why: 'The clue is the timing: an unpopular job on that one particular afternoon. When an odd choice lines up exactly with an opportunity, the opportunity is the reason.' },
        { text: 'He praised the plan loudly in the meeting and then went straight to the manager to criticise it.',
          q: 'What does this tell you?', opts: ['He says what suits him to whoever is in front of him', 'He changed his mind honestly', 'He did not understand the plan', 'He is very shy'], ans: 0,
          why: 'The clue is "and then went straight". No time passed, so no genuine change of mind happened. Different audiences got different opinions, which means neither is honest.' },
        { text: 'The shopkeeper gave the children free sweets every Friday and never let them into the back room.',
          q: 'What does the pairing suggest?', opts: ['The generosity may be keeping them away from something', 'He is simply very kind', 'He dislikes children', 'The sweets were out of date'], ans: 0,
          why: 'The clue is that the writer puts the two facts in one sentence. Being generous at the front and secretive at the back is a way of directing where people look.' },
        { text: 'After the will was read, the cousin who had never visited began telephoning every week.',
          q: 'Why the sudden interest?', opts: ['Money, because the behaviour changed right after the will', 'She suddenly missed the family', 'She got a new telephone', 'She had been ill before'], ans: 0,
          why: 'The clue is the timing again. The change begins immediately after the will. When behaviour changes the moment money appears, the money is the cause.' },
        { text: '"I am only telling you this because I care about you," she said, before repeating the rumour.',
          q: 'What is the phrase doing?', opts: ['Giving her an excuse to gossip', 'Showing genuine concern', 'Ending the conversation', 'Apologising properly'], ans: 0,
          why: 'The clue is what follows the phrase. If she truly cared she could simply not repeat it. The sentence is there to make the gossip sound acceptable.' },
        { text: 'The manager praised the team publicly and took the bonus privately.',
          q: 'What is his real priority?', opts: ['Himself', 'The team', 'The customers', 'The company'], ans: 0,
          why: 'The clue is the contrast between public and private. He gives away the thing that costs nothing, words, and keeps the thing that has value.' },
        { text: 'He apologised immediately, before anyone had told him what he had done.',
          q: 'What does that suggest?', opts: ['He already knew he had done something wrong', 'He is extremely polite', 'He apologises to everyone', 'He misheard'], ans: 0,
          why: 'The clue is the order. You cannot apologise for something you have not yet heard about unless you already knew. The speed gives him away.' },
        { text: 'She kept the broken watch for forty years but threw away the photographs.',
          q: 'What does this suggest?', opts: ['The watch means more to her than the pictures do', 'She likes broken things', 'She hated photography', 'She forgot about the watch'], ans: 0,
          why: 'The clue is the contrast: keeping the useless thing and discarding the valuable ones. What people keep when it makes no practical sense is what holds the memory.' }
      ]
    },

    {
      id: 'buildup', name: 'Building a Picture', icon: '\u{1F5BC}️',
      rule: 'Details do not arrive at random. Read them all, then ask what they add up to.',
      points: [
        'One detail is a fact. Three details pointing the same way is a conclusion.',
        'Collect them before you decide. Do not answer on the first one.',
        'Ask what ALL of these have in common, not what each one means alone.',
        'If one detail disagrees with the others, that is usually the important one.',
        'The writer chose every single detail, so there are no accidents.'
      ],
      example: {
        text: 'The gate hung off one hinge. Grass had grown through the gravel. Three years of post lay behind the door.',
        q: 'What do these three details add up to?',
        steps: [
          'Take them one at a time: a broken gate, weeds in the gravel, uncollected post.',
          'Ask what they share. Each one is something nobody has dealt with.',
          'The post gives you roughly how long: three years.'
        ],
        a: 'Nobody has lived here for about three years.'
      },
      qs: [
        { text: 'His shoes were polished. His shirt was ironed. His hands would not keep still.',
          q: 'What do these add up to?', opts: ['He has made an effort but is nervous', 'He is completely relaxed', 'He is untidy', 'He is unwell'], ans: 0,
          why: 'The first two details agree with each other: care taken over appearance. The third disagrees, and the odd one out is the clue. Effort plus restless hands means something important is about to happen.' },
        { text: 'Two cups on the table. Both still warm. The back door standing open.',
          q: 'What can you work out?', opts: ['Two people were here and left in a hurry, very recently', 'Nobody has been here for weeks', 'One person is asleep upstairs', 'There was a party'], ans: 0,
          why: 'Three details, each adding something. Two cups means two people. Still warm means minutes ago. The open door means they left without stopping to close it.' },
        { text: 'She knew the code to the safe. She knew which night the alarm was off. She had asked for the week off months before.',
          q: 'What is being built here?', opts: ['A case that she planned it', 'A case that she is innocent', 'A description of her job', 'A holiday plan'], ans: 0,
          why: 'Each detail alone is explainable. Together they are knowledge, opportunity and an alibi arranged in advance. Three things pointing one way is no longer coincidence.' },
        { text: 'The fridge was empty. The bin was full of takeaway boxes. There were no plates in the cupboard, only mugs.',
          q: 'What do these suggest about the person living here?', opts: ['They do not cook and may be living alone and unsettled', 'They are an excellent cook', 'They have a large family', 'They have just moved in with everything they need'], ans: 0,
          why: 'All three details point at the same absence: no cooking. Empty fridge, takeaway boxes, and no plates each remove another part of making a meal.' },
        { text: 'Everyone at the table laughed. The youngest boy looked at his plate.',
          q: 'Why does the writer mention the boy separately?', opts: ['Because he is the one who is not fine', 'To show he was hungry', 'Because he told the joke', 'Because he could not hear'], ans: 0,
          why: 'The clue is the contrast. A writer who wanted a happy scene would stop at "everyone laughed". Singling out the one who did not is the whole point of the second sentence.' },
        { text: 'New curtains. Fresh paint on the front door only. A For Sale board at the gate.',
          q: 'Why paint the front door and nothing else?', opts: ['They are making the house look good enough to sell', 'They love that colour', 'The rest was painted last year', 'The door was damaged'], ans: 0,
          why: 'The third detail explains the first two. "Only" is doing the work: effort spent on what a buyer sees, and nowhere else.' },
        { text: 'The dog would not go into the kitchen. It had always slept in the kitchen.',
          q: 'What does the change tell you?', opts: ['Something in there has changed and the dog has noticed', 'The dog is being naughty', 'The dog is tired', 'Dogs do not like kitchens'], ans: 0,
          why: 'The clue is "always", which sets up the normal, then the break from it. A change in a reliable pattern always has a cause, and animals notice before people do.' },
        { text: 'He mentioned the money twice. Then the weather. Then the money again.',
          q: 'What is he actually here to talk about?', opts: ['The money', 'The weather', 'Nothing in particular', 'His health'], ans: 0,
          why: 'Count them: money, money, money, against weather once. What someone keeps returning to is the real subject, and the other topics are the polite covering.' }
      ]
    }
  ];

  function shuffle(a) {
    const c = [...a];
    for (let i = c.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [c[i], c[j]] = [c[j], c[i]];
    }
    return c;
  }

  /** Questions for one skill, options shuffled so the answer moves around. */
  function questionsFor(id) {
    const s = SKILLS.find((x) => x.id === id) || SKILLS[0];
    return shuffle(s.qs).map((q) => {
      const correct = q.opts[q.ans];
      const opts = shuffle(q.opts);
      return { text: q.text, q: q.q, opts, ans: opts.indexOf(correct), why: q.why };
    });
  }

  /** A mixed set across every skill. */
  function makeMixed(n) {
    const all = SKILLS.flatMap((s) => s.qs.map((q) => ({ ...q, skill: s.name })));
    return shuffle(all).slice(0, n).map((q) => {
      const correct = q.opts[q.ans];
      const opts = shuffle(q.opts);
      return { text: q.text, q: q.q, opts, ans: opts.indexOf(correct), why: q.why, skill: q.skill };
    });
  }

  root.Y56_IMAGERY = { SKILLS, questionsFor, makeMixed };
})(typeof window !== 'undefined' ? window : globalThis);
