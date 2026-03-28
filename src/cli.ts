#!/usr/bin/env node

import { detectLocale } from "./content";
import { renderProfile } from "./render";

console.log(renderProfile(detectLocale()));
