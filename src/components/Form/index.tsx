import React, { useState } from 'react';
import {
  View, 
  Text,
  Image, 
  TouchableOpacity,
  TextInput
} from 'react-native';

import { styles } from './styles';
import * as FileStystem from 'expo-file-system';
import { ArrowLeft } from 'phosphor-react-native';
import { captureScreen } from 'react-native-view-shot';

import { feedbackTypes } from '../../utils/feedbackTypes';
import { theme } from '../../theme';

import { FeedbackType } from '../Widget';
import { Button } from '../Button';
import { ScreenshotButton } from '../ScreenshotButton';
import { api } from '../../lib/api';


interface Props {
  feedbackType: FeedbackType;
  onFeedbackCanceled: () => void;
  onFeedbackSend: () => void;
}

export function Form({feedbackType, onFeedbackCanceled, onFeedbackSend}: Props){
  const [isSendingFeedback, setIsSendingFeedback] = useState(false);
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [comment, setComment] = useState("")

  const feedbackInfo = feedbackTypes[feedbackType]
  
  function handleScreenshot(){
    captureScreen({
      format: 'jpg',
      quality: 0.8
    })

    .then(uri => setScreenshot(uri))
    .catch(error => console.log(error));
  }

  function handleScreenshotRemove(){
    setScreenshot(null);
  }

  async function handleSendFeedback(){
    if (isSendingFeedback) {
      return;
    }

    setIsSendingFeedback(true);
    const screenshotBase64 = screenshot && await FileStystem.readAsStringAsync(screenshot, { encoding: 'base64'});

    try {
      await api.post('/feedbacks', {
        type: feedbackType,
        screenshot: `data:image/png;base64, ${screenshotBase64}`,
        comment
      });

      onFeedbackSend();

    } catch (error) {
      console.log(error)
      setIsSendingFeedback(false)
    }
  }
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onFeedbackCanceled}>
          <ArrowLeft 
            size={24}
            weight="bold"
            color={theme.colors.text_secondary}
          />
        </TouchableOpacity>

        <View style={styles.titleContainer}>
          <Image 
            source={feedbackInfo.image}
            style={styles.image}
          />
          <Text style={styles.titleText}>
            {feedbackInfo.title}
          </Text>
        </View>
      </View>
      
      <TextInput 
        multiline
        style={styles.input}
        placeholder="Algo não está funcionando bem? Queremos corrigir. Conte com detalhes o que está acontecendo..."
        placeholderTextColor={theme.colors.text_secondary}
        autoCorrect={false}
        onChangeText={setComment}
      />

      <View style={styles.footer}>
        <ScreenshotButton 
          onTakeShot={handleScreenshot}
          onRemoveShot={handleScreenshotRemove}
          screenshot={screenshot}
        />

        <Button
          onPress={handleSendFeedback}
          isLoading={isSendingFeedback}
        />
      </View>
    </View>
  )
}