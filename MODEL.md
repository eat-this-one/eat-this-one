##
# This document explains why we have the current relations between documents.
#
# @wip
##

Over anything else we want (in order):
# Prevent corrupted data when embedding data into documents
# Peformance
# Avoid multiple queries to perform the most used actions
# Avoid too much code in the application side
# Avoid storing embedded data we do not need in documents

The chosen approach is the defensive one, so we only embed
when we are sure that the embedded data will not be updated
to avoid possible problems with concurrency, positioning...

---------------------------------------------------------------


ENTITIES & RELATIONS
----------------------

user (may change)
 (no references)

location (does not change)
 |- userid (ref, having the location creator is only for log purposes)

dish (may change)
 |- userid (ref)
 |- location (embed)

locationSubscription
 |- userid (ref)
 |- location (embed)

meal (does not change)
 |- userid (ref)
 |- dishid (ref)


MOST COMMON ACTIONS
-------------------

GET user
  * 2 DB queries -> GET token + GET user
GET dish (dish + location + user)
  - Dish data
  - Location data
  - User data
  * 3 DB queries -> GET token + GET dish + GET user
POST meal (user + dish)
  * 2 DB queries -> GET token + POST meal
GET meals (users + dish)
  * 3 DB queries + N * users -> GET token + GET dish + GET meals + GET user * N users

OTHER ACTIONS
------------------------

GET location (typeahead)
