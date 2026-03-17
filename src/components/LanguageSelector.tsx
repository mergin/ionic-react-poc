import { useState } from 'react';
import { IonButton, IonItem, IonLabel, IonList, IonPopover } from '@ionic/react';
import { useI18n } from '../i18n';

export function LanguageSelector() {
  const { locale, setLocale, t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <IonButton
        aria-label={t('common.languageSelector')}
        fill="clear"
        onClick={() => setIsOpen(true)}
      >
        {locale === 'en' ? t('common.englishShort') : t('common.spanishShort')}
      </IonButton>

      <IonPopover isOpen={isOpen} onDidDismiss={() => setIsOpen(false)}>
        <IonList>
          <IonItem
            button
            detail={false}
            onClick={() => {
              setLocale('en');
              setIsOpen(false);
            }}
          >
            <IonLabel>{t('common.englishShort')}</IonLabel>
          </IonItem>
          <IonItem
            button
            detail={false}
            onClick={() => {
              setLocale('es');
              setIsOpen(false);
            }}
          >
            <IonLabel>{t('common.spanishShort')}</IonLabel>
          </IonItem>
        </IonList>
      </IonPopover>
    </>
  );
}
