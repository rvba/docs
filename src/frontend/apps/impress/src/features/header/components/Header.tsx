import { useTranslation } from 'react-i18next';
import { useEditorStore } from '@/features/docs/doc-editor/stores';
import { css } from 'styled-components';
import { useRouter } from 'next/router';

import IconDocs from '@/assets/icons/icon-docs.svg';
import { Box, StyledLink, BoxButton } from '@/components/';
import { fetchAPI } from '@/api';
import { useCunninghamTheme } from '@/cunningham';
import { ButtonLogin } from '@/features/auth';
import { LanguagePicker } from '@/features/language';
import { useResponsiveStore } from '@/stores';

import { HEADER_HEIGHT } from '../conf';

import { ButtonTogglePanel } from './ButtonTogglePanel';
import { LaGaufre } from './LaGaufre';
import { Title } from './Title';

export const Header = () => {
  const { t } = useTranslation();
  const { spacingsTokens, colorsTokens } = useCunninghamTheme();
  const { isDesktop } = useResponsiveStore();
  const { editor } = useEditorStore();

  const handlePushClick = async () => {
    console.log('Push button clicked');
    let documentId = null;
    if (typeof window !== 'undefined') {
      const pathSegments = window.location.pathname.split('/');
      const docIndex = pathSegments.indexOf('docs');
      if (docIndex !== -1 && docIndex < pathSegments.length - 1) {
        documentId = pathSegments[docIndex + 1];
        console.log('Extracted documentId from URL:', documentId);
      } else {
        console.error('Could not extract documentId from URL:', window.location.pathname);
      }
    } else {
      console.error('Cannot access window.location on server side');
    }
    

    try {
      if (!editor) {
        console.error('Editor not available');
        return;
      }

      const allBlocks = editor.topLevelBlocks;
      const markdownContent = await editor.blocksToMarkdownLossy(allBlocks);

      const response = await fetchAPI(`documents/${documentId}/push/`, {
        method: 'POST',
        body: JSON.stringify({
          document_id: documentId,
          content: markdownContent
        }),
      });

      if (response.ok) {
        console.log('Push API call successful', await response.json());
      } else {
        console.error('Push API call failed', response.status, await response.text());
      }
    } catch (error) {
      console.error('Error calling Push API', error);
    }
  };

  return (
    <Box
      as="header"
      $css={css`
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 1000;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        height: ${HEADER_HEIGHT}px;
        padding: 0 ${spacingsTokens['base']};
        background-color: ${colorsTokens['greyscale-000']};
        border-bottom: 1px solid ${colorsTokens['greyscale-200']};
      `}
      className="--docs--header"
    >
      {!isDesktop && <ButtonTogglePanel />}
      <StyledLink href="/">
        <Box
          $align="center"
          $gap={spacingsTokens['3xs']}
          $direction="row"
          $position="relative"
          $height="fit-content"
          $margin={{ top: 'auto' }}
        >
          <IconDocs
            aria-label={t('Docs Logo')}
            width={32}
            color={colorsTokens['primary-text']}
          />
          <Title />
        </Box>
      </StyledLink>
      {!isDesktop ? (
        <Box $direction="row" $gap={spacingsTokens['sm']}>
            <BoxButton onClick={handlePushClick}>
              Push
            </BoxButton>
          <LaGaufre />
        </Box>
      ) : (
        <Box $align="center" $gap={spacingsTokens['sm']} $direction="row">
          <ButtonLogin />
          <LanguagePicker />
            <BoxButton onClick={handlePushClick}>
              Push
            </BoxButton>
          <LaGaufre />
        </Box>
      )}
    </Box>
  );
};
