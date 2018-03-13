<?xml version="1.0" encoding="UTF-8"?>
<Workflow xmlns="http://soap.sforce.com/2006/04/metadata">
    <alerts>
        <fullName>Email_alert_Student_Invitation_Notification</fullName>
        <description>Email alert - Student Invitation Notification</description>
        <protected>false</protected>
        <recipients>
            <field>Student_Name__c</field>
            <type>userLookup</type>
        </recipients>
        <senderType>CurrentUser</senderType>
        <template>DW_Folder/Email_Alert_Template_Student_Invitation_Notification</template>
    </alerts>
    <fieldUpdates>
        <fullName>Update_Next_Due_Date_of_Student</fullName>
        <field>Next_Due__c</field>
        <formula>DATE(
year(DATEVALUE(Class__r.End_Date_Time__c))
+ floor((month(DATEVALUE(Class__r.End_Date_Time__c)) + Class__r.Course__r.Required_Frequency__c)/12) + if(and(month(DATEVALUE(Class__r.End_Date_Time__c))=12,Class__r.Course__r.Required_Frequency__c&gt;=12),-1,0)
,
if( mod( month(DATEVALUE(Class__r.End_Date_Time__c)) + Class__r.Course__r.Required_Frequency__c, 12 ) = 0, 12 , mod( month(DATEVALUE(Class__r.End_Date_Time__c)) + Class__r.Course__r.Required_Frequency__c, 12 ))
,
min(
day(DATEVALUE(Class__r.End_Date_Time__c)),
case(
max( mod( month(DATEVALUE(Class__r.End_Date_Time__c)) + Class__r.Course__r.Required_Frequency__c, 12 ) , 1),
9,30,
4,30,
6,30,
11,30,
2,if(mod((year(DATEVALUE(Class__r.End_Date_Time__c))
+ floor((month(DATEVALUE(Class__r.End_Date_Time__c)) + Class__r.Course__r.Required_Frequency__c)/12) + if(and(month(DATEVALUE(Class__r.End_Date_Time__c))=12,Class__r.Course__r.Required_Frequency__c&gt;=12),-1,0)),4)=0,29,28),
31
)
)
)</formula>
        <name>Update Next Due Date of Student</name>
        <notifyAssignee>false</notifyAssignee>
        <operation>Formula</operation>
        <protected>false</protected>
        <reevaluateOnChange>true</reevaluateOnChange>
    </fieldUpdates>
    <rules>
        <fullName>Student Invitation Notification</fullName>
        <actions>
            <name>Email_alert_Student_Invitation_Notification</name>
            <type>Alert</type>
        </actions>
        <active>true</active>
        <criteriaItems>
            <field>Student__c.Status__c</field>
            <operation>equals</operation>
            <value>Invited</value>
        </criteriaItems>
        <triggerType>onCreateOnly</triggerType>
    </rules>
    <rules>
        <fullName>Update Next Due Date of Student</fullName>
        <actions>
            <name>Update_Next_Due_Date_of_Student</name>
            <type>FieldUpdate</type>
        </actions>
        <active>true</active>
        <criteriaItems>
            <field>Student__c.CreatedDate</field>
            <operation>notEqual</operation>
        </criteriaItems>
        <triggerType>onAllChanges</triggerType>
    </rules>
</Workflow>
