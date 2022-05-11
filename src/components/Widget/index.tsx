import React, { useRef, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';

import BottomSheet from '@gorhom/bottom-sheet';
import { ChatTeardropDots} from 'phosphor-react-native';

import { styles } from './styles';
import { theme } from '../../theme';

import { Options } from '../Options';
import { Form } from '../Form';
import { Success } from '../Success';

import { feedbackTypes } from '../../utils/feedbackTypes';

export type FeedbackType = keyof typeof feedbackTypes

function Widget() {
  const [feedbackType, setFeedbackType] = useState<FeedbackType | null>(null);
  const [feedbackSend, setFeedbackSend] = useState(false);

  const bottomSheetRef= useRef<BottomSheet>(null)

  function handleOpen(){
    bottomSheetRef.current?.expand();
  }

  function handleRestartFeedback(){
    setFeedbackSend(false);
    setFeedbackType(null);
  }

  function handleRestartSent(){
    setFeedbackSend(true);
  }

  return (
    <>
      <TouchableOpacity style={styles.button} onPress={handleOpen}>
        <ChatTeardropDots 
          size={24}
          weight="bold"
          color={theme.colors.text_on_brand_color}
        />
      </TouchableOpacity>
      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={[1, 280]}
        backgroundStyle={styles.modal}
        handleIndicatorStyle={styles.indicator}
      >
        {
          feedbackSend ?
            <Success 
              onSendAnotherFeedback={handleRestartFeedback}
            />
            :
            <>
              {
                feedbackType ? 
                <Form 
                  feedbackType={feedbackType}
                  onFeedbackCanceled={handleRestartFeedback}
                  onFeedbackSend={handleRestartSent}
                />
                :
                <Options onFeedbackTypeChanged={setFeedbackType} />
              }
            </>
        }
      </BottomSheet>
    </>
  )
}

export default gestureHandlerRootHOC(Widget);