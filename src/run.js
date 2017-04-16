#!/usr/bin/env node
'use strict'

const program = require('commander')
const chalk = require('chalk')
const execute = require('./index')
const env = process.env

program
  .version(require('./../package.json').version)
  .option(
    '-k, --aws-access-key <k>',
    'aws access key, can be defined via AWS_ACCESS_KEY_ID env variable',
    String,
    env.AWS_ACCESS_KEY_ID
  )
  .option(
    '-s, --aws-secret-key <k>',
    'aws secret key, can be defined via AWS_SECRET_ACCESS_KEY env variable',
    String,
    env.AWS_SECRET_ACCESS_KEY
  )
  .option(
    '-r, --region <r>',
    'aws region, can be defined via AWS_DEFAULT_REGION env variable.',
    String,
    env.AWS_DEFAULT_REGION
  )
  .option(
    '-c, --cluster <c>',
    'ecs cluster, can be defined via AWS_ECS_CLUSTER env variable',
    String,
    env.AWS_ECS_CLUSTER
  )
  .option(
    '-n, --service <n>',
    'ecs service, can be defined via AWS_ECS_SERVICE_NAME env variable',
    String,
    env.AWS_ECS_SERVICE_NAME
  )
  .option(
    '-i, --image <i>',
    'docker image to use in new task definition e.g. user/image:tag, can be defined via AWS_ECS_TASK_IMAGE env variable',
    String,
    env.AWS_ECS_TASK_IMAGE
  )
  .option(
    '-t, --timeout <t>',
    'maximum timeout (sec) to wait for ECS service to launch new task, defaults to 180',
    parseInt,
    '180'
  )
  .option('-v, --verbose', 'enable verbose mode')
  .option(
    '--kill-task',
    'stop a running task to allow space for a rolling blue/green deployment'
  )
  .parse(process.argv)

execute(program).then(ctx => complete(ctx), e => error([e]))

function complete(ctx) {
  ctx.errors.length ? error(ctx.errors) : success(ctx.newTask)
}

function error(errors) {
  errors.forEach(e => {
    const msg = e instanceof Error ? e.message : e
    console.error(chalk.red(msg))
  })
  process.exit(1)
}

function success(newTask) {
  console.info(
    chalk.bold.cyan(`task '${newTask.taskDefinitionArn}' created and deployed`)
  )
  process.exit(0)
}
