import { JSONSchemaType } from 'ajv';
import {
  Presentation,
  Slide,
  SlideElement,
  TextElement,
  ImageElement,
  SlideBackground,
} from './customtypes';
import { ShowModalType } from './EditorType';

const textElementSchema: JSONSchemaType<TextElement> = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    type: { type: 'string', const: 'text' },
    position: {
      type: 'object',
      properties: {
        x: { type: 'number' },
        y: { type: 'number' },
      },
      required: ['x', 'y'],
    },
    size: {
      type: 'object',
      properties: {
        width: { type: 'number' },
        height: { type: 'number' },
      },
      required: ['width', 'height'],
    },
    content: { type: 'string' },
    fontFamily: { type: 'string' },
    fontSize: { type: 'number' },
    fontColor: { type: 'string' },
  },
  required: ['id', 'type', 'position', 'size', 'content', 'fontFamily', 'fontSize', 'fontColor'],
};

const imageElementSchema: JSONSchemaType<ImageElement> = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    type: { type: 'string', const: 'image' },
    position: {
      type: 'object',
      properties: {
        x: { type: 'number' },
        y: { type: 'number' },
      },
      required: ['x', 'y'],
    },
    size: {
      type: 'object',
      properties: {
        width: { type: 'number' },
        height: { type: 'number' },
      },
      required: ['width', 'height'],
    },
    content: { type: 'string' },
  },
  required: ['id', 'type', 'position', 'size', 'content'],
};

const slideElementSchema: JSONSchemaType<SlideElement> = {
  oneOf: [textElementSchema, imageElementSchema],
};

const slideBackgroundSchema: JSONSchemaType<SlideBackground> = {
  oneOf: [
    {
      type: 'object',
      properties: {
        type: { type: 'string', const: 'color' },
        color: { type: 'string' },
      },
      required: ['type', 'color'],
    },
    {
      type: 'object',
      properties: {
        type: { type: 'string', const: 'image' },
        imageUrl: { type: 'string' },
      },
      required: ['type', 'imageUrl'],
    },
  ],
};

const slideSchema: JSONSchemaType<Slide> = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    background: slideBackgroundSchema,
    elements: {
      type: 'array',
      items: slideElementSchema,
    },
  },
  required: ['id', 'background', 'elements'],
};

const presentationSchema: JSONSchemaType<Presentation> = {
  type: 'object',
  properties: {
    title: { type: 'string' },
    slides: {
      type: 'array',
      items: slideSchema,
    },
  },
  required: ['title', 'slides'],
};

const selectionSchema = {
  type: 'object',
  properties: {
    selectedSlideId: {
      anyOf: [
        { type: 'string' },
        { type: 'null' },
      ],
    },
    selectedElementId: {
      anyOf: [
        { type: 'string' },
        { type: 'null' },
      ],
    },
    selectedSlidesIdList: {
      anyOf: [
        { type: 'array', items: { type: 'string' } },
        { type: 'null' },
      ],
    },
    selectedElementsIdList: {
      anyOf: [
        { type: 'array', items: { type: 'string' } },
        { type: 'null' },
      ],
    },
  },
  required: [
    'selectedSlideId',
    'selectedElementId',
    'selectedSlidesIdList',
    'selectedElementsIdList',
  ],
};

const showModalSchema: JSONSchemaType<ShowModalType> = {
  type: 'object',
  properties: {
    showModalWindowSetBackground: { type: 'boolean' },
    showModalWindowAddElement: { type: 'boolean' },
  },
  required: ['showModalWindowSetBackground', 'showModalWindowAddElement'],
};

const editorTypeSchema = {
  type: 'object',
  properties: {
    presentation: presentationSchema,
    selection: {
      anyOf: [
        selectionSchema,
        { type: 'null' },
      ],
    },
    showModal: showModalSchema,
  },
  required: ['presentation', 'selection', 'showModal'],
};

export default editorTypeSchema;