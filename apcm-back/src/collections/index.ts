import {CollectionConfig} from "payload";
import Association from './Association';
import Article from './Article';
import Users from './User';
import Action from './Action';
import Membre from './Membre';
import Contact from '@/collections/Contact'

const collections: CollectionConfig[] = [
    Association,
    Article,
    Users,
    Action,
    Membre,
    Contact
];

export default collections;
