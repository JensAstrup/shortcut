/* eslint-disable */

import ShortcutResource from '@sx/base-resource'
import Client from '@sx/client'
import Iteration from '@sx/iterations/iteration'
import Member from '@sx/members/member'
import Story from '@sx/stories/story'
import Team from '@sx/teams/team'
import Workflow from '@sx/workflows/workflow'
import Epic from '@sx/epics/epic'
import Objective from '@sx/objectives/objective'
import Label from '@sx/labels/label'
import KeyResult from '@sx/key-results/key-result'
import LinkedFile from '@sx/linked-files/linked-file'
import CustomField from '@sx/custom-fields/custom-field'
import UploadedFile from '@sx/uploaded-files/uploaded-file'

// Services
import BaseService from '@sx/base-service'
import StoriesService from '@sx/stories/stories-service'
import IterationsService from '@sx/iterations/iterations-service'
import TeamsService from '@sx/teams/teams-service'
import MembersService from '@sx/members/members-service'
import WorkflowsService from '@sx/workflows/workflows-service'
import EpicsService from '@sx/epics/epics-service'
import ObjectivesService from '@sx/objectives/objectives-service'
import LabelsService from '@sx/labels/labels-service'
import KeyResultsService from '@sx/key-results/key-results-service'
import LinkedFilesService from '@sx/linked-files/linked-files-service'
import CustomFieldsService from '@sx/custom-fields/custom-fields-service'
import UploadedFilesService from '@sx/uploaded-files/uploaded-files-service'

// Interfaces
import ThreadedCommentInterface from '@sx/threaded-comments/contracts/threaded-comment-interface'
import CreateThreadedCommentData from '@sx/threaded-comments/contracts/create-threaded-comment-data'
import {StoryCommentInterface} from '@sx/stories/comment/contracts/story-comment-interface'
import KeyResultValueInterface from '@sx/key-results/contracts/key-result-value-interface'
import LinkedFileInterface from '@sx/linked-files/contracts/linked-file-interface'
import CreateLinkedFileData from '@sx/linked-files/contracts/create-linked-file-data'
import CustomFieldInterface from '@sx/custom-fields/contracts/custom-field-interface'
import UploadedFileInterface from '@sx/uploaded-files/contracts/uploaded-file-interface'

export default Client
export {Client, Iteration, Member, Story, Team, Workflow, Epic, Objective, Label, KeyResult, LinkedFile, CustomField, UploadedFile}
export {
    BaseService,
    StoriesService,
    IterationsService,
    TeamsService,
    MembersService,
    WorkflowsService,
    EpicsService,
    ObjectivesService,
    LabelsService,
    KeyResultsService,
    LinkedFilesService,
    CustomFieldsService,
    UploadedFilesService
}
export {
    ThreadedCommentInterface,
    CreateThreadedCommentData,
    StoryCommentInterface,
    KeyResultValueInterface,
    LinkedFileInterface,
    CreateLinkedFileData,
    CustomFieldInterface,
    UploadedFileInterface
}
export {ShortcutResource}
