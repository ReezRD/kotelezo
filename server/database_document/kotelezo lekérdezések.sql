select * from loaning;
select * from opus;
select * from specimen;
select * from student;

# get .../student
  SELECT * from student;

# get loaningSpecimen (inner join)
select * from loaning l
  inner join specimen s on s.sId = l.id;

# get opusSpecimen
  select * from opus o 
    inner join specimen s on s.opusid  = o.id;

# get everything

  select o.id, o.writer, o.title, o.year, s.sId, s.opusid, s.price, s.acquisition, l.id, l.specimentid, l.studentid, l.away, l.back, st.id, st.name, st.year  from opus o
    inner join specimen s on s.opusid = o.id
    inner join loaning l on l.specimentid = s.sId
    inner join student st on st.id = l.studentid
    order by st.name;

