import { StatusBar } from 'expo-status-bar';
import { useMemo, useState } from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { createExperienceDraft, toggleContextualHeart } from './src/domain/experience';
import { rankExperiences, type RankedExperience } from './src/domain/ranking';

type ExperienceCard = RankedExperience & {
  place: string;
  area: string;
  author: string;
  message: string;
  color: string;
};

const experiences: ExperienceCard[] = [
  {
    id: 'friend-cafe',
    place: 'Hillside Café',
    area: 'Steveston',
    author: 'Mia · a friend',
    message: 'Soft rain, warm light, easy conversation.',
    relationship: 'friend',
    tags: ['cozy', 'catch-up', 'coffee'],
    distanceKm: 1.1,
    hoursOld: 4,
    contextualHearts: 3,
    color: '#D9B19B',
  },
  {
    id: 'public-park',
    place: 'Iona Beach',
    area: 'Sea Island',
    author: 'David · local guide',
    message: 'The kind of sunset walk that resets the whole week.',
    relationship: 'taste-match',
    tags: ['outdoors', 'solo', 'reset'],
    distanceKm: 6.2,
    hoursOld: 22,
    contextualHearts: 8,
    color: '#A4C6BE',
  },
  {
    id: 'public-drinks',
    place: 'The Story Café',
    area: 'Richmond Centre',
    author: 'Sofia · nearby',
    message: 'Lively enough for a Friday night without feeling too loud.',
    relationship: 'public',
    tags: ['lively', 'drinks', 'friends'],
    distanceKm: 0.8,
    hoursOld: 3,
    contextualHearts: 12,
    color: '#A6B7D8',
  },
];

const moods = [
  { label: 'For you', tags: ['cozy', 'catch-up', 'drinks'] },
  { label: 'Drinks', tags: ['drinks', 'lively'] },
  { label: 'Dinner', tags: ['dinner', 'catch-up'] },
  { label: 'With friends', tags: ['friends', 'catch-up', 'lively'] },
  { label: 'Solo reset', tags: ['solo', 'reset'] },
  { label: 'Outdoors', tags: ['outdoors', 'reset'] },
];

export default function App() {
  const [activeMood, setActiveMood] = useState('For you');
  const [heartedIds, setHeartedIds] = useState<string[]>([]);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [isComposerOpen, setComposerOpen] = useState(false);
  const [note, setNote] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>(['cozy']);
  const [communityExperiences, setCommunityExperiences] = useState<ExperienceCard[]>([]);

  const feed = useMemo(() => {
    const mood = moods.find((item) => item.label === activeMood) ?? moods[0];
    const allExperiences = [...communityExperiences, ...experiences];
    return rankExperiences(allExperiences, { desiredTags: mood.tags, currentHour: 18 }) as ExperienceCard[];
  }, [activeMood, communityExperiences]);

  const heart = (id: string) =>
    setHeartedIds((current) => toggleContextualHeart(current, id));

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View style={styles.topbar}>
          <View>
            <Text style={styles.brand}>morrow</Text>
            <Text style={styles.location}>RICHMOND, BC</Text>
          </View>
          <View style={styles.avatar}><Text style={styles.avatarText}>J</Text></View>
        </View>

        <Text style={styles.title}>Find your next{`\n`}good feeling.</Text>
        <Text style={styles.subtitle}>Real moments from people and places around you.</Text>

        <Text style={styles.sectionLabel}>WHAT ARE YOU UP FOR?</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
          {moods.map((mood) => (
            <Pressable key={mood.label} onPress={() => setActiveMood(mood.label)} style={[styles.chip, activeMood === mood.label && styles.chipActive]}>
              <Text style={[styles.chipText, activeMood === mood.label && styles.chipTextActive]}>{mood.label}</Text>
            </Pressable>
          ))}
        </ScrollView>

        <View style={styles.feedHeading}>
          <Text style={styles.feedTitle}>For you</Text>
          <Text style={styles.feedHint}>Because you like cozy places</Text>
        </View>

        {feed.map((experience) => {
          const isHearted = heartedIds.includes(experience.id);
          const isSaved = savedIds.includes(experience.id);
          return (
            <View key={experience.id} style={styles.card}>
              <View style={[styles.photo, { backgroundColor: experience.color }]}>
                <Text style={styles.photoMark}>{experience.tags[0]}</Text>
                <View style={styles.photoGlow} />
              </View>
              <View style={styles.cardContent}>
                <View style={styles.cardHeader}>
                  <View><Text style={styles.place}>{experience.place}</Text><Text style={styles.area}>{experience.area}</Text></View>
                  <Text style={styles.distance}>{experience.distanceKm} km</Text>
                </View>
                <Text style={styles.message}>“{experience.message}”</Text>
                <Text style={styles.author}>{experience.author}</Text>
                <View style={styles.tags}>{experience.tags.slice(0, 2).map((tag) => <Text key={tag} style={styles.tag}>{tag}</Text>)}</View>
                <View style={styles.actions}>
                  <Pressable onPress={() => heart(experience.id)} style={[styles.action, isHearted && styles.actionHearted]}>
                    <Text style={styles.actionText}>{isHearted ? '♥ I feel this too' : '♡ I feel this too'}</Text>
                  </Pressable>
                  <Pressable onPress={() => setSavedIds((items) => items.includes(experience.id) ? items.filter((id) => id !== experience.id) : [...items, experience.id])} style={styles.saveAction}>
                    <Text style={styles.saveText}>{isSaved ? 'Saved' : 'Save'}</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>

      {isComposerOpen && <View style={styles.composer}><Text style={styles.composerTitle}>Share a small moment</Text><Text style={styles.composerPlace}>At Hillside Café · Steveston</Text><View style={styles.composerTags}>{['cozy', 'lively', 'catch-up', 'solo', 'reset'].map((tag) => <Pressable key={tag} onPress={() => setSelectedTags((tags) => tags.includes(tag) ? tags.filter((item) => item !== tag) : [...tags, tag])} style={[styles.composerTag, selectedTags.includes(tag) && styles.composerTagActive]}><Text style={[styles.composerTagText, selectedTags.includes(tag) && styles.composerTagTextActive]}>{tag}</Text></Pressable>)}</View><TextInput value={note} onChangeText={setNote} placeholder="How did it feel?" placeholderTextColor="#8C857D" style={styles.input} /><View style={styles.composerActions}><Pressable onPress={() => setComposerOpen(false)}><Text style={styles.cancel}>Cancel</Text></Pressable><Pressable onPress={() => { const draft = createExperienceDraft({ placeId: 'hillside-cafe', tags: selectedTags, caption: note || 'A small moment worth remembering.', visibility: 'followers' }); setCommunityExperiences((items) => [{ id: `you-${draft.createdAt}`, place: 'Hillside Café', area: 'Steveston', author: 'You · just now', message: draft.caption ?? '', relationship: 'friend', tags: draft.tags, distanceKm: 1.1, hoursOld: 0, contextualHearts: 0, color: '#D9B19B' }, ...items]); setNote(''); setSelectedTags(['cozy']); setComposerOpen(false); }} style={styles.post}><Text style={styles.postText}>Share</Text></Pressable></View></View>}
      <Pressable onPress={() => setComposerOpen(true)} style={styles.fab}><Text style={styles.fabText}>＋</Text></Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F6F1',
  },
  scroll: { padding: 22, paddingBottom: 110 },
  topbar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  brand: { fontSize: 28, fontWeight: '800', color: '#22201D', letterSpacing: -1.2 },
  location: { fontSize: 10, fontWeight: '700', letterSpacing: 1.4, color: '#7A736B', marginTop: 2 },
  avatar: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#2E5B50', alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#FFF', fontWeight: '700' },
  title: { fontSize: 39, lineHeight: 43, fontWeight: '700', letterSpacing: -1.7, color: '#22201D', marginTop: 34 },
  subtitle: { fontSize: 15, lineHeight: 21, color: '#6D6760', marginTop: 12, maxWidth: 290 },
  sectionLabel: { fontSize: 10, fontWeight: '800', letterSpacing: 1.2, color: '#7A736B', marginTop: 33, marginBottom: 12 },
  chips: { gap: 8, paddingRight: 20 },
  chip: { paddingVertical: 10, paddingHorizontal: 14, borderRadius: 22, backgroundColor: '#ECE8E1' },
  chipActive: { backgroundColor: '#2E5B50' },
  chipText: { color: '#504B45', fontWeight: '600', fontSize: 13 },
  chipTextActive: { color: '#FFF' },
  feedHeading: { marginTop: 34, marginBottom: 14 },
  feedTitle: { fontSize: 23, fontWeight: '700', color: '#22201D', letterSpacing: -0.5 },
  feedHint: { marginTop: 3, fontSize: 12, color: '#817A72' },
  card: { backgroundColor: '#FFFDF9', borderRadius: 22, overflow: 'hidden', marginBottom: 18, shadowColor: '#2B2723', shadowOpacity: 0.06, shadowRadius: 14, shadowOffset: { width: 0, height: 5 }, elevation: 2 },
  photo: { height: 148, padding: 17, justifyContent: 'flex-end' },
  photoMark: { fontSize: 12, fontWeight: '700', color: '#FFF', textTransform: 'uppercase', letterSpacing: 1.3, zIndex: 1 },
  photoGlow: { position: 'absolute', right: -30, top: -40, width: 160, height: 160, borderRadius: 80, backgroundColor: 'rgba(255,255,255,0.18)' },
  cardContent: { padding: 17 }, cardHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  place: { fontSize: 18, fontWeight: '700', color: '#282521' }, area: { color: '#827B73', marginTop: 2, fontSize: 12 },
  distance: { fontSize: 12, color: '#827B73', marginTop: 3 },
  message: { fontSize: 16, lineHeight: 23, color: '#3F3933', marginTop: 15, fontStyle: 'italic' }, author: { fontSize: 12, color: '#6C655E', marginTop: 9 },
  tags: { flexDirection: 'row', gap: 7, marginTop: 12 }, tag: { backgroundColor: '#EDF2EE', color: '#3C6559', fontSize: 11, fontWeight: '700', paddingVertical: 5, paddingHorizontal: 9, borderRadius: 12 },
  actions: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 17 },
  action: { backgroundColor: '#F5F0EA', paddingHorizontal: 11, paddingVertical: 8, borderRadius: 17 }, actionHearted: { backgroundColor: '#F6E7E4' },
  actionText: { color: '#685D56', fontSize: 12, fontWeight: '700' }, saveAction: { padding: 8 }, saveText: { color: '#2E5B50', fontSize: 13, fontWeight: '800' },
  fab: { position: 'absolute', right: 24, bottom: 26, width: 58, height: 58, borderRadius: 29, backgroundColor: '#2E5B50', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.18, shadowRadius: 10, elevation: 4 }, fabText: { color: '#FFF', fontSize: 28, fontWeight: '300', marginTop: -2 },
  composer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 22, backgroundColor: '#FFFDF9', borderTopLeftRadius: 26, borderTopRightRadius: 26, shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 15, elevation: 8 }, composerTitle: { fontSize: 19, fontWeight: '700', color: '#26221F' }, composerPlace: { color: '#6D766E', fontSize: 12, marginTop: 4, fontWeight: '700' }, composerTags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 12 }, composerTag: { backgroundColor: '#EEEAE3', paddingVertical: 6, paddingHorizontal: 9, borderRadius: 14 }, composerTagActive: { backgroundColor: '#2E5B50' }, composerTagText: { color: '#675F58', fontSize: 11, fontWeight: '700' }, composerTagTextActive: { color: '#FFF' }, input: { backgroundColor: '#F3F0EA', padding: 14, minHeight: 72, borderRadius: 14, marginTop: 14, color: '#2C2824', textAlignVertical: 'top' }, composerActions: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', gap: 20, marginTop: 14 }, cancel: { color: '#706A63', fontWeight: '700' }, post: { backgroundColor: '#2E5B50', paddingVertical: 10, paddingHorizontal: 17, borderRadius: 18 }, postText: { color: '#FFF', fontWeight: '800' },
});
