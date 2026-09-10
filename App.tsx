import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
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
    color: '#D4AE50',
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

function BootScreen({ onFinish }: { onFinish: () => void }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.88)).current;

  useEffect(() => {
    const animation = Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 760, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, friction: 7, tension: 32, useNativeDriver: true }),
    ]);
    animation.start();
    const timeout = setTimeout(onFinish, 2200);
    return () => {
      animation.stop();
      clearTimeout(timeout);
    };
  }, [onFinish, opacity, scale]);

  return (
    <View style={styles.boot}>
      <View style={[styles.bootOrb, styles.bootOrbOne]} />
      <View style={[styles.bootOrb, styles.bootOrbTwo]} />
      <Animated.View style={[styles.bootContent, { opacity, transform: [{ scale }] }]}>
        <Text style={styles.bootBrand}>Morrow</Text>
        <Text style={styles.bootSlogan}>Find your next favorite experience.</Text>
      </Animated.View>
    </View>
  );
}

export default function App() {
  const [isBooting, setBooting] = useState(true);
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

  if (isBooting) {
    return <BootScreen onFinish={() => setBooting(false)} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View style={styles.topbar}>
          <View>
            <Text style={styles.brand}>Morrow</Text>
            <Text style={styles.location}>RICHMOND, BC</Text>
          </View>
          <View style={styles.avatar}><Text style={styles.avatarText}>J</Text></View>
        </View>

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
    backgroundColor: '#171321',
  },
  scroll: { padding: 22, paddingBottom: 110 },
  topbar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  brand: { fontSize: 28, fontWeight: '800', color: '#FFF8FF', letterSpacing: -1.2 },
  location: { fontSize: 10, fontWeight: '700', letterSpacing: 1.4, color: '#F5D76E', marginTop: 2 },
  avatar: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#9B7CFF', alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#FFF', fontWeight: '700' },
  sectionLabel: { fontSize: 10, fontWeight: '800', letterSpacing: 1.2, color: '#C3B8D7', marginTop: 32, marginBottom: 12 },
  chips: { gap: 8, paddingRight: 20 },
  chip: { paddingVertical: 10, paddingHorizontal: 14, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.11)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)' },
  chipActive: { backgroundColor: 'rgba(180,145,255,0.5)', borderColor: '#F5D76E' },
  chipText: { color: '#DCD4E7', fontWeight: '600', fontSize: 13 },
  chipTextActive: { color: '#FFF' },
  feedHeading: { marginTop: 34, marginBottom: 14 },
  feedTitle: { fontSize: 23, fontWeight: '700', color: '#FFF8FF', letterSpacing: -0.5 },
  feedHint: { marginTop: 3, fontSize: 12, color: '#F0D782' },
  card: { backgroundColor: 'rgba(255,255,255,0.11)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.16)', borderRadius: 26, overflow: 'hidden', marginBottom: 18, shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 18, shadowOffset: { width: 0, height: 8 }, elevation: 3 },
  photo: { height: 148, padding: 17, justifyContent: 'flex-end' },
  photoMark: { fontSize: 12, fontWeight: '700', color: '#FFF', textTransform: 'uppercase', letterSpacing: 1.3, zIndex: 1 },
  photoGlow: { position: 'absolute', right: -30, top: -40, width: 160, height: 160, borderRadius: 80, backgroundColor: 'rgba(255,255,255,0.32)' },
  cardContent: { padding: 17 }, cardHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  place: { fontSize: 18, fontWeight: '700', color: '#FFF8FF' }, area: { color: '#B9AECC', marginTop: 2, fontSize: 12 },
  distance: { fontSize: 12, color: '#B9AECC', marginTop: 3 },
  message: { fontSize: 16, lineHeight: 23, color: '#EFE8F4', marginTop: 15, fontStyle: 'italic' }, author: { fontSize: 12, color: '#C5BBD0', marginTop: 9 },
  tags: { flexDirection: 'row', gap: 7, marginTop: 12 }, tag: { backgroundColor: 'rgba(198,171,255,0.24)', color: '#E8DEFF', fontSize: 11, fontWeight: '700', paddingVertical: 5, paddingHorizontal: 9, borderRadius: 12 },
  actions: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 17 },
  action: { backgroundColor: 'rgba(255,255,255,0.12)', paddingHorizontal: 11, paddingVertical: 8, borderRadius: 17 }, actionHearted: { backgroundColor: 'rgba(236,151,229,0.34)' },
  actionText: { color: '#EEE6F7', fontSize: 12, fontWeight: '700' }, saveAction: { padding: 8 }, saveText: { color: '#D7C6FF', fontSize: 13, fontWeight: '800' },
  fab: { position: 'absolute', right: 24, bottom: 26, width: 58, height: 58, borderRadius: 29, backgroundColor: '#A17CFF', borderWidth: 2, borderColor: '#F5D76E', alignItems: 'center', justifyContent: 'center', shadowColor: '#F5D76E', shadowOpacity: 0.38, shadowRadius: 14, elevation: 4 }, fabText: { color: '#FFF', fontSize: 28, fontWeight: '300', marginTop: -2 },
  composer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 22, backgroundColor: '#2A203D', borderTopWidth: 1, borderColor: 'rgba(255,255,255,0.19)', borderTopLeftRadius: 26, borderTopRightRadius: 26, shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 15, elevation: 8 }, composerTitle: { fontSize: 19, fontWeight: '700', color: '#FFF8FF' }, composerPlace: { color: '#C8BFE0', fontSize: 12, marginTop: 4, fontWeight: '700' }, composerTags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 12 }, composerTag: { backgroundColor: 'rgba(255,255,255,0.12)', paddingVertical: 6, paddingHorizontal: 9, borderRadius: 14 }, composerTagActive: { backgroundColor: '#9B7CFF' }, composerTagText: { color: '#E2D9EA', fontSize: 11, fontWeight: '700' }, composerTagTextActive: { color: '#FFF' }, input: { backgroundColor: 'rgba(255,255,255,0.12)', padding: 14, minHeight: 72, borderRadius: 14, marginTop: 14, color: '#FFF', textAlignVertical: 'top' }, composerActions: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', gap: 20, marginTop: 14 }, cancel: { color: '#D2C7E3', fontWeight: '700' }, post: { backgroundColor: '#9B7CFF', paddingVertical: 10, paddingHorizontal: 17, borderRadius: 18 }, postText: { color: '#FFF', fontWeight: '800' },
  boot: { flex: 1, backgroundColor: '#160B28', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }, bootOrb: { position: 'absolute', borderRadius: 999 }, bootOrbOne: { width: 360, height: 360, backgroundColor: '#6D2E90', top: -110, left: -105, opacity: 0.9 }, bootOrbTwo: { width: 320, height: 320, backgroundColor: '#F5D76E', bottom: -140, right: -95, opacity: 0.72 }, bootContent: { alignItems: 'center', padding: 30 }, bootBrand: { color: '#F4C8FF', fontSize: 62, lineHeight: 66, fontWeight: '900', fontStyle: 'italic', letterSpacing: -3, textShadowColor: '#8E37C1', textShadowRadius: 18, textShadowOffset: { width: 0, height: 5 } }, bootSlogan: { color: '#FFF4FF', fontSize: 15, fontWeight: '700', letterSpacing: 0.2, marginTop: 18, textAlign: 'center' },
});
