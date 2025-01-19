import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './TopPanel.module.css';
import { SlideBackground } from '../../store/customtypes';
import UnsplashImageSearch from '../../components/UnsplashImageSearch';

type TopPanelProps = {
  presentationTitle: string;
  onRenameTitle: (newTitle: string) => void;
  onAddSlide: () => void;
  onDeleteSlide: () => void;
  onAddElement: (type: 'text' | 'image', content?: string) => void;
  onRemoveElement: () => void;
  onChangeBackground: (newBackground: SlideBackground) => void;
  onExport: () => void;
  onImport: (file: File) => void;
  onUndo: () => void;
  onRedo: () => void;
  onExportToPdf: () => void;
  onChangeFontFamily: (fontFamily: string) => void;
  onChangeFontSize: (fontSize: number) => void;
  onChangeFontColor: (fontColor: string) => void;
  selectedElementId: string | null;
};

const TopPanel: React.FC<TopPanelProps> = ({
  presentationTitle,
  onRenameTitle,
  onAddSlide,
  onDeleteSlide,
  onAddElement,
  onRemoveElement,
  onChangeBackground,
  onExport,
  onImport,
  onUndo,
  onRedo,
  onExportToPdf,
  onChangeFontFamily,
  onChangeFontSize,
  onChangeFontColor,
  selectedElementId,
}) => {
  const [editing, setEditing] = useState(false);
  const [tempTitle, setTempTitle] = useState(presentationTitle);
  const [showImageSearch, setShowImageSearch] = useState(false);
  const [activeTab, setActiveTab] = useState<'insert' | 'edit' | 'background' | 'export'>('insert');
  const [backgroundInput, setBackgroundInput] = useState('');
  const [backgroundColor, setBackgroundColor] = useState('#FFFFFF');
  const [fontFamily, setFontFamily] = useState('Arial');
  const [fontSize, setFontSize] = useState(16);
  const [fontColor, setFontColor] = useState('#000000');
  const navigate = useNavigate();

  const handleEditTitle = () => setEditing(true);

  const handleSaveTitle = () => {
    onRenameTitle(tempTitle);
    setEditing(false);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        onAddElement('image', imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImport(file);
    }
  };

  const handleSelectImageFromUnsplash = (imageUrl: string) => {
    onAddElement('image', imageUrl);
    setShowImageSearch(false);
  };

  const handleGoToPlayer = () => {
    navigate('/player');
  };

  const handleBackgroundChange = () => {
    const isColor = /^#[0-9A-Fa-f]{6}$/.test(backgroundInput);
    onChangeBackground(
      isColor
        ? { type: 'color', color: backgroundInput }
        : { type: 'image', imageUrl: backgroundInput }
    );
  };

  const handleBackgroundColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value;
    setBackgroundColor(color);
    onChangeBackground({ type: 'color', color });
  };

  const handleFontFamilyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newFontFamily = e.target.value;
    setFontFamily(newFontFamily);
    onChangeFontFamily(newFontFamily);
  };

  const handleFontSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFontSize = parseInt(e.target.value, 10);
    setFontSize(newFontSize);
    onChangeFontSize(newFontSize);
  };

  const handleFontColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFontColor = e.target.value;
    setFontColor(newFontColor);
    onChangeFontColor(newFontColor);
  };

  return (
    <div className={styles.topPanel}>
      <div className={styles.titleContainer}>
        {editing ? (
          <input
            type="text"
            value={tempTitle}
            onChange={(e) => setTempTitle(e.target.value)}
            onBlur={handleSaveTitle}
            className={styles.titleInput}
            autoFocus
          />
        ) : (
          <h3 className={styles.title} onClick={handleEditTitle}>
            {presentationTitle}
          </h3>
        )}
        <button className={styles.button} onClick={handleGoToPlayer}>
          Перейти к слайд-шоу
        </button>
      </div>

      <div className={styles.tabsContainer}>
        <button
          className={`${styles.tabButton} ${activeTab === 'insert' ? styles.active : ''}`}
          onClick={() => setActiveTab('insert')}
        >
          Вставка
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === 'edit' ? styles.active : ''}`}
          onClick={() => setActiveTab('edit')}
        >
          Редактирование
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === 'background' ? styles.active : ''}`}
          onClick={() => setActiveTab('background')}
        >
          Фон
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === 'export' ? styles.active : ''}`}
          onClick={() => setActiveTab('export')}
        >
          Экспорт
        </button>
      </div>

      <div className={styles.buttonsContainer}>
        {activeTab === 'insert' && (
          <>
            <button className={styles.button} onClick={onAddSlide}>
              Добавить слайд
            </button>
            <button className={styles.button} onClick={() => onAddElement('text')}>
              Добавить текст
            </button>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: 'none' }}
              id="image-upload"
            />
            <label htmlFor="image-upload" className={styles.button}>
              Добавить изображение
            </label>
            <button className={styles.button} onClick={() => setShowImageSearch(true)}>
              Добавить изображение из Unsplash
            </button>
          </>
        )}

        {activeTab === 'edit' && (
          <>
            <button className={styles.button} onClick={onDeleteSlide}>
              Удалить слайд
            </button>
            <button className={styles.button} onClick={onRemoveElement}>
              Удалить элемент
            </button>
            <button className={styles.button} onClick={onUndo}>
              Отменить (Ctrl+Z)
            </button>
            <button className={styles.button} onClick={onRedo}>
              Повторить (Ctrl+Y)
            </button>
          </>
        )}

        {activeTab === 'background' && (
          <>
            <button
              className={styles.button}
              onClick={() => onChangeBackground({ type: 'color', color: '#FFFFFF' })}
            >
              Очистить фон
            </button>
            <div className={styles.backgroundControl}>
              <input
                type="color"
                value={backgroundColor}
                onChange={handleBackgroundColorChange}
              />
              <input
                type="text"
                className={styles.backgroundInput}
                placeholder="Введите ссылку на изображение"
                value={backgroundInput}
                onChange={(e) => setBackgroundInput(e.target.value)}
              />
              <button
                className={styles.button}
                onClick={handleBackgroundChange}
                disabled={!backgroundInput.trim()} 
              >
                Применить фон
              </button>
            </div>
          </>
        )}

        {activeTab === 'export' && (
          <>
            <button className={styles.button} onClick={onExport}>
              Сохранить
            </button>
            <input
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
              id="import-file"
            />
            <label htmlFor="import-file" className={styles.button}>
              Открыть
            </label>
            <button className={styles.button} onClick={onExportToPdf}>
              Экспорт в PDF
            </button>
          </>
        )}

        {selectedElementId && (
          <div className={styles.textControls}>
            <select value={fontFamily} onChange={handleFontFamilyChange}>
              <option value="Arial">Arial</option>
              <option value="Times New Roman">Times New Roman</option>
              <option value="Courier New">Courier New</option>
              <option value="Verdana">Verdana</option>
              <option value="Georgia">Georgia</option>
            </select>
            <input
              type="number"
              value={fontSize}
              onChange={handleFontSizeChange}
              min="10"
              max="72"
            />
            <input
              type="color"
              value={fontColor}
              onChange={handleFontColorChange}
            />
          </div>
        )}
      </div>

      {showImageSearch && (
        <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', padding: '20px', zIndex: 1000 }}>
          <UnsplashImageSearch onSelectImage={handleSelectImageFromUnsplash} />
          <button onClick={() => setShowImageSearch(false)}>Закрыть</button>
        </div>
      )}
    </div>
  );
};

export default TopPanel;