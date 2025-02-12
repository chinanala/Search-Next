/*
 * @Author: Vir
 * @Date: 2021-10-07 10:16:22
 * @Last Modified by: Vir
 * @Last Modified time: 2021-12-20 09:33:04
 */

import React from 'react';
import {
  Fade,
  Modal as MModal,
  Backdrop,
  Button,
  IconButton,
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { Close } from '@material-ui/icons';
import classnames from 'classnames';
import { css } from '@emotion/css';

export interface DialogProps {
  open: boolean;
  title: string | (() => void);
  onOk: (value?: any) => void;
  onCancel: () => void;
  okText?: string;
  cancelText?: string;
  children?: any;
  container?: Element;
}

const Dialog: React.FC<DialogProps> = ({
  open,
  title,
  onOk,
  onCancel,
  okText,
  cancelText,
  children,
  container,
}) => {
  const { t } = useTranslation();

  return (
    <MModal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={open}
      onClose={onCancel}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
      container={container}
    >
      <Fade in={open}>
        <div
          className={classnames(
            'rounded absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-100',
            css`
              background-color: rgba(255, 255, 255, 0.9);
              backdrop-filter: blur(8px);
            `,
          )}
        >
          <div className="p-3 py-2 font-bold text-base flex justify-between items-center">
            {title}
            <IconButton size="small" onClick={onCancel}>
              <Close />
            </IconButton>
          </div>
          <div className="p-4">{children}</div>
          <div className="p-2 flex justify-end gap-2">
            <Button variant="text" onClick={onCancel}>
              {cancelText ? cancelText : t('cancel')}
            </Button>
            <Button variant="text" onClick={onOk}>
              {okText ? okText : t('submit')}
            </Button>
          </div>
        </div>
      </Fade>
    </MModal>
  );
};

export default Dialog;
