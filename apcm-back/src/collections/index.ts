import {CollectionConfig} from "payload";
import Association from './Association';
import Article from './Article';
import Users from './User';
import Membre from './Membre';
import Contact from '@/collections/Contact'

const collections: CollectionConfig[] = [
    Association,
    Article,
    Users,
    Membre,
    Contact
];

export default collections;
