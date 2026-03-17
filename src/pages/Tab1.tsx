import { useEffect, useState } from 'react';
import {
  IonAvatar,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { LanguageSelector } from '../components/LanguageSelector';
import { useI18n } from '../i18n';
import './Tab1.css';

interface SocialPost {
  id: string;
  avatarUrl: string;
  content: string;
  author: {
    handle: string;
    displayName: string;
  };
  likes: number;
  replies: number;
}

const POSTS_URL = 'https://api-gateway.example.com/v1/social/posts';

const Tab1: React.FC = () => {
  const { t } = useI18n();
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    void fetch(POSTS_URL, { signal: controller.signal })
      .then(async response => {
        if (!response.ok) {
          throw new Error('Unable to load posts');
        }

        const payload = (await response.json()) as SocialPost[];
        setPosts(payload);
        setHasError(false);
      })
      .catch(() => {
        setHasError(true);
      })
      .finally(() => {
        setIsLoading(false);
      });

    return () => controller.abort();
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>{t('tabs.tab1')}</IonTitle>
          <IonButtons slot="end">
            <LanguageSelector />
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">{t('tabs.tab1')}</IonTitle>
          </IonToolbar>
        </IonHeader>

        {isLoading ? (
          <IonItem role="status">
            <IonLabel>{t('social.loading')}</IonLabel>
          </IonItem>
        ) : null}

        {hasError ? (
          <IonItem role="alert">
            <IonLabel>{t('social.loadError')}</IonLabel>
          </IonItem>
        ) : null}

        {!isLoading && !hasError ? (
          <IonList aria-label={t('social.feedAriaLabel')}>
            {posts.map(post => (
              <IonCard key={post.id}>
                <IonCardHeader>
                  <IonItem lines="none">
                    <IonAvatar slot="start">
                      <img src={post.avatarUrl} alt={t('social.avatarAlt', { name: post.author.displayName })} />
                    </IonAvatar>
                    <IonLabel>
                      <IonCardTitle>{post.author.displayName}</IonCardTitle>
                      <IonCardSubtitle>@{post.author.handle}</IonCardSubtitle>
                    </IonLabel>
                  </IonItem>
                </IonCardHeader>
                <IonCardContent>
                  <p>{post.content}</p>
                  <p className="social-meta">
                    {t('social.like')}: {post.likes} • {t('social.replies')}: {post.replies}
                  </p>
                </IonCardContent>
              </IonCard>
            ))}
          </IonList>
        ) : null}
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
